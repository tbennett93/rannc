using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Rannc.Models;

namespace Rannc.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly UserContext _userContext;
        public UserRepository(UserContext userContext)
        {
            this._userContext = userContext;
        }

        public async Task<long> FindUserIdFromName(string userName)
        {
            var user = await _userContext.LoginModel.FirstOrDefaultAsync(u => u.UserName == userName);
            return user.Id;
        }
    }
}