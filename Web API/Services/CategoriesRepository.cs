using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Rannc.Models;

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

        //public async Task<List<CategoryItemsModel>> GetCategoryItems(long userId, int categoryId)
        //{
        //    _iLogger.LogInformation("CategoriesRepo.Get called");

        //    List<CategoryItemsModel> userCategoryItems = await _userContext.CategoryItems
        //        .Where(u => u.CategoryModelId == categoryId)
        //        .Include(u => u.CategoryModel)
        //        .Select(u => new CategoryItemsModel()
        //        {
        //            Name = u.Name,
        //            Group = u.Group,
        //            Order = u.Order,
        //            Comment = u.Comment,
        //            CategoryModelId = u.CategoryModelId,
        //            CategoryModel = u.CategoryModel
        //        })
        //        .ToListAsync();

        //    if (userCategoryItems != null) return userCategoryItems;

        //    _iLogger.LogWarning("Unable to retrieve user category items for category ID {id}", categoryId);
        //    return null;

        //}
        public async Task<List<CategoryItemsModel>> GetCategoryItems(int categoryId, long userId)
        {
            _iLogger.LogInformation("CategoriesRepo.Get called");

            //List<CategoryItemsModel> userCategoryItems = await _userContext.CategoryItems
            //    .Where(u => u.CategoryModelId == categoryId)
            //    .Include(u => u.CategoryModel)
            //    .ThenInclude(u=> u.LoginModel)
            //    .Where(u=> u.)
            //    .Select(u => new CategoryItemsModel()
            //    {
            //        Id = u.Id,
            //        Name = u.Name,
            //        Group = u.Group,
            //        Order = u.Order,
            //        Comment = u.Comment,
            //        CategoryModelId = u.CategoryModelId,
            //        CategoryModel = u.CategoryModel
            //    })
            //    .ToListAsync();


            List<CategoryItemsModel> userCategoryItems = await _userContext.CategoryItems
                .Where(u => u.CategoryModelId == categoryId)
                .Include(u => u.CategoryModel)
                .ThenInclude(u => u.LoginModel)
                .Where(u => u.CategoryModel.LoginModelId == userId)
                .Select(u => new CategoryItemsModel()
                {
                    Id = u.Id,
                    Name = u.Name,
                    Group = u.Group,
                    Order = u.Order,
                    Comment = u.Comment,
                    CategoryModelId = u.CategoryModelId,
                    CategoryModel = u.CategoryModel
                })
                .ToListAsync();

            if (userCategoryItems != null) return userCategoryItems;

            _iLogger.LogWarning("Unable to retrieve user category items for category ID {id}", categoryId);
            return null;

        }

        public async Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryItemsModel, long userId)
        {

            var userHasCategory = await _userContext.Categories.AnyAsync(u =>
                u.Id == categoryItemsModel.CategoryModelId && u.LoginModelId == userId);

            if (!userHasCategory)
                return null;

            await _userContext.CategoryItems.AddAsync(categoryItemsModel);

            if (await _userContext.SaveChangesAsync() == 0)
                return null;
            
            return categoryItemsModel;
        }

        public async Task<bool> UserExists(long userId)
        {

            return await _userContext.Categories
                .Where(u => u.LoginModelId == userId)
                .AnyAsync();
        }

        public async Task<bool> DeleteCategoryItemAsync(long id, long userId)
        {

            var userHasCategory = await _userContext.CategoryItems
                .Include(u=>u.CategoryModel)
                .AnyAsync(u =>
                u.Id == id && u.CategoryModel.LoginModelId == userId);

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
    }
}
