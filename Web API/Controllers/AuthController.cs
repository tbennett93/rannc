using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserContext _userContext;
        private readonly ITokenService _tokenService;
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<AuthController> _iLogger;


        public AuthController(
            ITokenService tokenService,
            IAuthRepository authRepository,
            UserContext userContext,
            ILogger<AuthController> iLogger
            )
        {
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            this._authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._iLogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));
        }

        [HttpPost, Route("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel loginModel)
        {
            _iLogger.LogInformation("POST AuthController.Register called {Username}", loginModel.UserName);
            loginModel.UserName = loginModel.UserName.ToLower();

            if (await _userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
            {
                _iLogger.LogWarning("POST AuthController.Register {Username} already exists", loginModel.UserName);
                return BadRequest("Username Already Exists");
            }

            await _authRepository.Register(loginModel.UserName, loginModel.Password);

            _iLogger.LogInformation("POST AuthController.Register success");
            return StatusCode(201);
        }

        // GET api/values
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {

            _iLogger.LogInformation("POST AuthController.Login called {Username}", loginModel.UserName);

            if (loginModel == null)
            {
                _iLogger.LogWarning("Login credentials bad/incomplete", loginModel.UserName);
                return BadRequest("Invalid client request");
            }

            loginModel.UserName = loginModel.UserName.ToLower();

            if (!await _userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
            {
                _iLogger.LogWarning("Username does not exist in db", loginModel.UserName);
                return BadRequest("Username does not exist");
            }


            var user = await _authRepository.Login(loginModel.UserName, loginModel.Password);
            if (user == null)
            {
                _iLogger.LogWarning("Username password combination invalid", loginModel.UserName);
                return Unauthorized();
            }


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginModel.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = _tokenService.RefreshTokenTime;

            _iLogger.LogInformation("Updating db with new refresh token", loginModel.UserName);
            await _userContext.SaveChangesAsync();
            _iLogger.LogInformation("Db update successful", loginModel.UserName);

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });


        }
    }
}
