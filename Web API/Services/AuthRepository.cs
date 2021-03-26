using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Rannc.Controllers;
using Rannc.Models;

namespace Rannc.Services
{
  

    public class AuthRepository : IAuthRepository
    {
        private UserContext _userContext;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly ILogger<AuthRepository> _iLogger;

        public AuthRepository(UserContext userContext, 
            IPasswordHasherService passwordHasherService,
            ILogger<AuthRepository> iLogger)
        {
            this._userContext = userContext;
            this._passwordHasher = passwordHasherService;
            this._iLogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));

        }

        public async Task<LoginModel> Login(string username, string password)
        {
            _iLogger.LogInformation("AuthRepository.Login called {Username}", username);

            username = username.ToLower();

            var user = await _userContext.LoginModel.FirstOrDefaultAsync(u =>
                u.UserName == username
            );


            if (_passwordHasher.GetHashedSaltedPassword(password, user.PasswordSalt) == user.Password)
            {   _iLogger.LogInformation("AuthRepository.Login Success");
                return user;
            }

            _iLogger.LogInformation("AuthRepository.Login Unsuccessful");
            return null;
        }

        public async Task Register(string username, string password)
        {
            _iLogger.LogInformation("AuthRepository.Register called {Username}", username);

            var passwordSalt = _passwordHasher.GetSalt();

            var loginModel = new LoginModel()
            {
                UserName = username,
                Password = _passwordHasher.GetHashedSaltedPassword(password, passwordSalt),
                PasswordSalt = passwordSalt

            };

            if (loginModel == null)
                _iLogger.LogWarning("Error creating new user", username);

            await _userContext.AddAsync(loginModel);
            _iLogger.LogInformation("Adding user to db", username);
            await _userContext.SaveChangesAsync();
            _iLogger.LogInformation("Added user to db", username);
        }
    }
}
