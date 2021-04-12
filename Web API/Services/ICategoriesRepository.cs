﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Rannc.Models;

namespace Rannc.Services
{
    public interface ICategoriesRepository
    {
        Task<List<CategoryModel>> GetCategories(long userId);
        //Task<List<CategoryItemsModel>> GetCategoryItems(long userId, int categoryId);
        Task<CategoryModel> PostCategory(CategoryModel categoryModel, long userId);

        Task<List<CategoryGroupsModel>> GetCategoryItems(int categoryId, long userId);

        Task<CategoryItemsModel> PostCategoryItem(CategoryItemsModel categoryModel, long userId, long categoryModelId);
        Task<CategoryGroupsModel> PostCategoryGroup(CategoryGroupsModel categoryModel, long userId, long categoryModelId);
        Task<bool> DeleteCategoryGroupAsync(long categoryGroupId, long userId, long categoryModelId);

        Task<bool> DeleteCategoryItemAsync(long id, long userId);
    }
}