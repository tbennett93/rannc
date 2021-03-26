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

        public async Task<List<CategoryModel>> GetCategories(long id)
        {
            _iLogger.LogInformation("CategoriesRepo.Get called");
            var userCategories = await _userContext.Categories.Where(u => u.LoginModelId == id).ToListAsync();
            if (userCategories == null)
                _iLogger.LogWarning("Unable to retrieve user categories");
            else
                _iLogger.LogInformation("User categories retrieved from db");

            return userCategories;
        }


    }
}
