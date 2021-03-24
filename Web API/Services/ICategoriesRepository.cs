using System.Collections.Generic;
using System.Threading.Tasks;
using Rannc.Models;

namespace Rannc.Services
{
    public interface ICategoriesRepository
    {
        Task<List<CategoryModel>> GetCategories(long id);
    }
}