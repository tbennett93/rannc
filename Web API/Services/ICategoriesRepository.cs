using System.Collections.Generic;
using System.Threading.Tasks;
using Rannc.Models;

namespace Rannc.Services
{
    public interface ICategoriesRepository
    {
        Task<List<CategoryModel>> GetCategories(long userId);
        //Task<List<CategoryItemsModel>> GetCategoryItems(long userId, int categoryId);
        Task<List<CategoryItemsModel>> GetCategoryItems(int categoryId);

        Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryItemsModel);
    }
}