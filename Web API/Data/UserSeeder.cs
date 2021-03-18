using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Data
{
    public class UserSeeder
    {
        private UserContext userContext;
        private IPasswordHasherService passwordHasher;
        public UserSeeder(UserContext userContext, IPasswordHasherService passwordHasher)
        { 
            this.userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this.passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(userContext));
        }

        public void Seed()
        {
            var user = userContext.LoginModel.FirstOrDefault(m => m.UserName == "johndoe");
            var passwordSalt = passwordHasher.GetSalt();
            user ??= new LoginModel()
            {
                UserName = "JohnDoe",
                Password = passwordHasher.GetHashedSaltedPassword("JohnDoePassword", passwordSalt),
                PasswordSalt = passwordSalt
            };
            userContext.Add(user);
            userContext.SaveChanges();
        }
    }
}
