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
        private UserContext _userContext;

        public CategoriesRepository(UserContext userContext)
        {
            this._userContext = userContext;
        }

        public async Task<List<CategoryModel>> GetCategories(long id)
        {
            var userCategories = await _userContext.Categories.Where(u => u.LoginModelId == id).ToListAsync();
            return userCategories;
        }


    }
}
