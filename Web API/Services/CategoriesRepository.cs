using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Rannc.Models;

namespace Rannc.Services
{
    public class CategoriesRepository : ICategoriesRepository
    {
        private UserContext userContext;

        public CategoriesRepository(UserContext userContext)
        {
            this.userContext = userContext;
        }

        public async Task<List<CategoryModel>> GetCategories(long userId)
        {
            var userCategories = await userContext.Categories.Where(u => u.LoginModelId == userId).ToListAsync();
            return userCategories;
        }


    }
}
