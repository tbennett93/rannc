using System.Collections.Generic;
using System.Threading.Tasks;
using Rannc.Models;

namespace Rannc.Services
{
    public interface ICategoriesRepository
    {
        Task<List<CategoryModel>> GetCategories(long userId);
        //Task<List<CategoryItemsModel>> GetCategoryItems(long userId, int categoryId);
        Task<CategoryModel> PostCategory(CategoryModel categoryModel, long userId);

        Task<List<CategoryItemsModel>> GetCategoryItems(int categoryId, long userId);

        Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryModel, long userId);

        Task<bool> DeleteCategoryItemAsync(long id, long userId);
    }
}