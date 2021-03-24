using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rannc.Models;

namespace Rannc.Services
{
  

    public class AuthRepository : IAuthRepository
    {
        private UserContext userContext;
        private readonly IPasswordHasherService passwordHasher;

        public AuthRepository(UserContext userContext, IPasswordHasherService passwordHasherService)
        {
            this.userContext = userContext;
            this.passwordHasher = passwordHasherService;

        }

        public async Task<LoginModel> Login(string username, string password)
        {
            username = username.ToLower();

            var user = await userContext.LoginModel.FirstOrDefaultAsync(u =>
                u.UserName == username
            );


            if (passwordHasher.GetHashedSaltedPassword(password, user.PasswordSalt) == user.Password)
                return user;

            return null;
        }

        public async Task Register(string username, string password)
        {
            var passwordSalt = passwordHasher.GetSalt();

            LoginModel loginModel = new LoginModel()
            {
                UserName = username,
                Password = passwordHasher.GetHashedSaltedPassword(password, passwordSalt),
                PasswordSalt = passwordSalt

            };
            await userContext.AddAsync(loginModel);
            await userContext.SaveChangesAsync();
        }
    }
}
