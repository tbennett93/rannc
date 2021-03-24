using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rannc.Models;

namespace Rannc.Services
{
  

    public class AuthRepository : IAuthRepository
    {
        private UserContext _userContext;
        private readonly IPasswordHasherService _passwordHasher;

        public AuthRepository(UserContext userContext, IPasswordHasherService passwordHasherService)
        {
            this._userContext = userContext;
            this._passwordHasher = passwordHasherService;

        }

        public async Task<LoginModel> Login(string username, string password)
        {
            username = username.ToLower();

            var user = await _userContext.LoginModel.FirstOrDefaultAsync(u =>
                u.UserName == username
            );


            if (_passwordHasher.GetHashedSaltedPassword(password, user.PasswordSalt) == user.Password)
                return user;

            return null;
        }

        public async Task Register(string username, string password)
        {
            var passwordSalt = _passwordHasher.GetSalt();

            LoginModel loginModel = new LoginModel()
            {
                UserName = username,
                Password = _passwordHasher.GetHashedSaltedPassword(password, passwordSalt),
                PasswordSalt = passwordSalt

            };
            await _userContext.AddAsync(loginModel);
            await _userContext.SaveChangesAsync();
        }
    }
}
