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
        private readonly UserContext _userContext;
        private readonly ITokenService _tokenService;
        private readonly IAuthRepository _authRepository;


        public AuthController(
            ITokenService tokenService,
            IAuthRepository authRepository,
            UserContext userContext
            )
        {
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            this._authRepository = authRepository ?? throw new ArgumentNullException(nameof(authRepository));
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        [HttpPost, Route("register")]
        public async Task<IActionResult> Register([FromBody] LoginModel loginModel)
        {
            loginModel.UserName = loginModel.UserName.ToLower();

            if ( await _userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
                return BadRequest("Username Already Exists");

            await _authRepository.Register(loginModel.UserName, loginModel.Password);
                return StatusCode(201);
        }

        // GET api/values
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {

            if (loginModel == null)
                return BadRequest("Invalid client request");

            loginModel.UserName = loginModel.UserName.ToLower();

            if (!await _userContext.LoginModel.AnyAsync(u => u.UserName == loginModel.UserName))
                return BadRequest("Username does not exist");

            var user = await _authRepository.Login(loginModel.UserName, loginModel.Password);
            if (user == null)
                return Unauthorized();


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginModel.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())

                //new Claim(ClaimTypes.Role, "Manager")
            };

            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = _tokenService.RefreshTokenTime;

            await _userContext.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });


        }
    }
}
