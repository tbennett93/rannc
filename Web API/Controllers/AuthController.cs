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
using Microsoft.IdentityModel.Tokens;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        readonly UserContext userContext;
        readonly ITokenService tokenService;
        private readonly IAuthRepository authRepository;


        public AuthController(
            ITokenService tokenService,
            IAuthRepository authRepository,
            UserContext userContext
            )
        {
            this.tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            this.authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            this.userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        [HttpPost, Route("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel loginModel)
        {
            loginModel.UserName = loginModel.UserName.ToLower();

            if ( await userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
                return BadRequest("Username Already Exists");

            await authRepository.Register(loginModel.UserName, loginModel.Password);
                return StatusCode(201);
        }

        // GET api/values
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {

            if (loginModel == null)
                return BadRequest("Invalid client request");

            loginModel.UserName = loginModel.UserName.ToLower();

            if (!await userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
                return BadRequest("Username does not exist");

            var user = await authRepository.Login(loginModel.UserName, loginModel.Password);
            if (user == null)
                return Unauthorized();


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginModel.UserName)
                //new Claim(ClaimTypes.Role, "Manager")
            };

            var accessToken = tokenService.GenerateAccessToken(claims);
            var refreshToken = tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = tokenService.RefreshTokenTime;

            await userContext.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });


        }
    }
}
