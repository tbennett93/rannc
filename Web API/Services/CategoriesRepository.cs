using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Rannc.Models;
using Rannc.Models.DTOs;

namespace Rannc.Services
{
    public class CategoriesRepository : ICategoriesRepository
    {
        private UserContext _userContext;
        private readonly ILogger<CategoriesRepository> _iLogger;

        public CategoriesRepository(UserContext userContext, ILogger<CategoriesRepository> iLogger)
        {
            this._userContext = userContext;
            this._iLogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));

        }

        public async Task<List<CategoryModel>> GetCategories(long userId)
        {
            _iLogger.LogInformation("CategoriesRepo.Get called");
            var userCategories = await _userContext.Categories
                .Where(u => u.LoginModelId == userId)
                .ToListAsync();
            if (userCategories == null)
                _iLogger.LogWarning("Unable to retrieve user categories");
            else
                _iLogger.LogInformation("User categories retrieved from db");
            return userCategories;
        }

        public async Task<CategoryModel> PostCategory(CategoryModel categoryModel, long userId)
        {

            var userExists = await UserExists(userId);

            if (!userExists)
                return null;

            await _userContext.Categories.AddAsync(categoryModel);

            if (await _userContext.SaveChangesAsync() == 0)
                return null;

            return categoryModel;
        }

        public async Task<LoginModel> GetCategoryItems(int categoryId)
        //public async Task<List<LoginModel>> GetCategoryItems(int categoryId, long userId)
        {
            _iLogger.LogInformation("CategoriesRepo.Get called");

            var userCategoryGroupItems = await _userContext.Categories
                    .Include(u => u.CategoryGroupsModels)
                    .ThenInclude(u => u.CategoryItemsModels)
                    .FirstOrDefaultAsync( u=> u.Id == categoryId)
                ;

            
            
            var user = new LoginModel();

            user = await _userContext.LoginModel.FirstOrDefaultAsync(u =>
                u.Id == userCategoryGroupItems.LoginModelId);


            user.CategoryModels.Add(userCategoryGroupItems);

            if (user != null) return user;

            _iLogger.LogWarning("Unable to retrieve user category items for category ID {id}", categoryId);
            return null;

        }

        public async Task<CategoryModel> GetCategoryItemsForClone(int categoryId, long userId)
            //public async Task<List<LoginModel>> GetCategoryItems(int categoryId, long userId)
        {
            _iLogger.LogInformation("CategoriesRepo.Get called");

            var userCategoryGroupItems = await _userContext.Categories
                    .Where(u => u.LoginModelId == userId)
                    .Include(u => u.CategoryGroupsModels)
                    .ThenInclude(u => u.CategoryItemsModels)
                    .AsNoTracking()
                    .SingleOrDefaultAsync(u => u.Id == categoryId)
                ;
            if (userCategoryGroupItems != null) return userCategoryGroupItems;

            _iLogger.LogWarning("Unable to retrieve user category items for category ID {id}", categoryId);
            return null;

        }

        public async Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryItemsModel, long userId, long categoryModelId)
        {

            var userHasCategory = await _userContext.Categories.AnyAsync(u =>
                u.Id == categoryModelId && u.LoginModelId == userId);

            if (!userHasCategory)
                return null;

            await _userContext.CategoryItems.AddAsync(categoryItemsModel);

            if (await _userContext.SaveChangesAsync() == 0)
                return null;
            
            return categoryItemsModel;
        }

        public async Task<CategoryGroupsModel> PostCategoryGroup(CategoryGroupsModel categoryGroupsModel, long userId, long categoryModelId)
        {

            var userHasCategory = await _userContext.Categories.AnyAsync(u =>
                u.Id == categoryModelId && u.LoginModelId == userId);

            if (!userHasCategory)
                return null;

            await _userContext.CategoryGroups.AddAsync(categoryGroupsModel);

            if (await _userContext.SaveChangesAsync() == 0)
                return null;

            return categoryGroupsModel;
        }

        public async Task<bool> DeleteCategoryGroupAsync(long categoryGroupId, long userId, long categoryModelId)
        {

            var categoryGroup = await _userContext.CategoryGroups
                .Include(u => u.CategoryModel)
                .FirstOrDefaultAsync(u => u.Id == categoryGroupId
                                          && u.CategoryModel.Id == categoryModelId
                                          && u.CategoryModel.LoginModelId == userId);

            if (categoryGroup == null)
                return false;

            _userContext.CategoryGroups.Remove(categoryGroup);
            return await _userContext.SaveChangesAsync() > 0;


        }

        public async Task<bool> UpdateCategoryGroupOrderAsync(List<CategoryGroupPutModelMapped> categoryGroups)
        {

            categoryGroups.ForEach(a =>
                 _userContext.CategoryGroups
                    .Where(c => c.CategoryModelId == a.CategoryId && c.Id == a.Id && c.Name == a.Name)
                    .ForEachAsync(c => c.Order = a.Order).Wait());

            return await _userContext.SaveChangesAsync() > 0;


        }

        public async Task<bool> UserExists(long userId)
        {

            return await _userContext.LoginModel
                .Where(u => u.Id == userId)
                .AnyAsync();
        }

        public async Task<bool> DeleteCategoryItemAsync(long id, long userId)
        {

            var userHasCategory = await _userContext.CategoryItems
                .Include(u=>u.CategoryGroupsModel.CategoryModel)
                .AnyAsync(u =>
                u.Id == id && u.CategoryGroupsModel.CategoryModel.LoginModelId == userId);

            if (!userHasCategory)
                return false;

            var categoryItemDb = await _userContext.CategoryItems.FindAsync(id);

            if (categoryItemDb == null)
            {
                return false;
            }

            _userContext.CategoryItems.Remove(categoryItemDb);

            return await _userContext.SaveChangesAsync() != 0;
        }

        public async Task<bool> DeleteCategoryAsync(long id, long userId)
        {
            var categoryGroup = await _userContext.Categories
                .FirstOrDefaultAsync(u => u.Id == id
                                          && u.LoginModelId == userId);

            if (categoryGroup == null)
                return false;

            _userContext.Categories.Remove(categoryGroup);
            return await _userContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateCategoryItemsOrderAsync(List<CategoryGroupsModel> categoryGroups)
        {
            categoryGroups.ForEach(async categoryModel =>
            {
                var groupId = categoryModel.Id;


                //get group
                var itemsDb = _userContext.CategoryItems;
                        

                if (itemsDb != null)
                {

                    foreach (var item in categoryModel.CategoryItemsModels)
                    {
                        var dbGroupItems = itemsDb
                            .Where(g => 
                                g.Id == item.Id &&
                                g.Name == item.Name
                            );
                        foreach (var dbItem in dbGroupItems)
                        {
                            dbItem.Order = item.Order;
                            dbItem.CategoryGroupsId = groupId;
                        }
                        //await groupsDb.Where(g => g.Id == item.Id)
                        //    .ForEachAsync(x=>
                        //    {
                        //        x.Order = item.Order;
                        //        x.CategoryGroupsId = groupId;
                        //        //&& x.CategoryGroupsId = groupId;
                        //    });
                    }


                }

            });
                
            return await _userContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> CopyTemplateToUser(CategoryModel categoryModel, int categoryId)
        {

            await _userContext.Categories.AddAsync(categoryModel);

            if (await _userContext.SaveChangesAsync() != 0)
            {
                var templateLog = new TemplateLoggerModel()
                {
                    DateSaved = DateTime.Now,
                    CategoryModelId = categoryId
                    //,
                    //CategoryModel = categoryModel
                };
                await _userContext.TemplatesLog.AddAsync(templateLog);
            }
            
            return await _userContext.SaveChangesAsync() != 0;



        }

        public async Task<LoginModel> GetTemplateUser()
        {
            return await _userContext.LoginModel.FirstOrDefaultAsync(u => u.UserName == "TemplateOwnerUser");
        }


        public async Task<List<CategoryModel>> GetTop5Categories()
        {
            _iLogger.LogInformation("CategoriesRepo.GetTop5 called");
            var Templates = _userContext.TemplatesLog
                .GroupBy(u => u.CategoryModelId)
                .Select(group => new
                {
                    Category = group.Key,
                    Count = group.Count()

                }).OrderByDescending(x => x.Count);
                ;

            var userCategories = new List<CategoryModel>();

                int loopCount = 0;
                foreach (var category in Templates)
                {
                    loopCount++;
                    if (loopCount > 5)
                        break;
                    var userCategory = await _userContext.Categories
                        .FirstOrDefaultAsync(u => u.Id == category.Category)
                        ;
                    userCategories.Add(userCategory);
                }

           
            if (userCategories == null)
                _iLogger.LogWarning("Unable to retrieve user categories");
            else
                _iLogger.LogInformation("User categories retrieved from db");
            return userCategories;
        }

        public async Task<List<CategoryModel>> GetTrendingCategories()
        {
            _iLogger.LogInformation("CategoriesRepo.GetTop5 called");
            var Templates = _userContext.TemplatesLog
                .Where(u => u.DateSaved > DateTime.Now.AddDays(-10))
                .GroupBy(u => u.CategoryModelId)
                .Select(group => new
                {
                    Category = group.Key,
                    Count = group.Count()

                }).OrderByDescending(x => x.Count);
            ;

            var userCategories = new List<CategoryModel>();


            foreach (var category in Templates)
            {

                var userCategory = await _userContext.Categories
                        .FirstOrDefaultAsync(u => u.Id == category.Category)
                    ;
                userCategories.Add(userCategory);
            }


            if (userCategories == null)
                _iLogger.LogWarning("Unable to retrieve user categories");
            else
                _iLogger.LogInformation("User categories retrieved from db");
            return userCategories;
        }
        public async Task<List<CategoryModel>> GetNewCategories(long userId)
        {
            _iLogger.LogInformation("CategoriesRepo.GetNew called");
            var Templates = _userContext.Categories
                .Where(u => u.LoginModelId == userId)
                .OrderByDescending(x => x.DateCreated);
            ;

            var userCategories = new List<CategoryModel>();
            int loopCount = 0;

            foreach (var category in Templates)
            {
                loopCount++;
                if (loopCount > 5)
                    break;
                userCategories.Add(category);
            }


            if (userCategories == null)
                _iLogger.LogWarning("Unable to retrieve user categories");
            else
                _iLogger.LogInformation("User categories retrieved from db");
            return userCategories;
        }
        

    }


}
