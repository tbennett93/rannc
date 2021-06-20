using System.Collections.Generic;
using System.Threading.Tasks;
using Rannc.Models;
using Rannc.Models.DTOs;

namespace Rannc.Services
{
    public interface ICategoriesRepository
    {
        Task<List<CategoryModel>> GetCategories(long userId);
        Task<List<CategoryModel>> GetTop5Categories();
        Task<List<CategoryModel>> GetTrendingCategories();
        Task<List<CategoryModel>> GetNewCategories(long userId);


        //Task<List<CategoryItemsModel>> GetCategoryItems(long userId, int categoryId);
        Task<CategoryModel> PostCategory(CategoryModel categoryModel, long userId);

        //Task<List<CategoryGroupsModel>> GetCategoryItems(int categoryId, long userId);
        Task<LoginModel> GetCategoryItems(int categoryId);

        Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryModel, long userId, long categoryModelId);
        Task<CategoryGroupsModel> PostCategoryGroup(CategoryGroupsModel categoryModel, long userId, long categoryModelId);
        Task<bool> DeleteCategoryGroupAsync(long categoryGroupId, long userId, long categoryModelId);

        Task<bool> DeleteCategoryItemAsync(long id, long userId);
        Task<bool> DeleteCategoryAsync(long id, long userId);

        Task<bool> UpdateCategoryGroupOrderAsync(List<CategoryGroupPutModelMapped> categoryGroups);
        Task<bool> UpdateCategoryItemsOrderAsync(List<CategoryGroupsModel> categoryGroups);

        Task<bool> CopyTemplateToUser(CategoryModel categoryModel, int categoryId);
        Task<LoginModel> GetTemplateUser();
        Task<CategoryModel> GetCategoryItemsForClone(int categoryId, long userId);
    }
}