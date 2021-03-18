using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
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

        public AuthController(
            UserContext userContext, 
            ITokenService tokenService,
            IPasswordHasherService passwordHasherService)
        {
            this.userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this.tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        // GET api/values
        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            if (loginModel == null)
            {
                return BadRequest("Invalid client request");
            }


            var user = userContext.LoginModel.FirstOrDefault(u => 
                u.UserName == loginModel.UserName &&
                u.Password == loginModel.Password
                );

            if (user == null)
            {
                return Unauthorized();
            }


            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginModel.UserName)
                //new Claim(ClaimTypes.Role, "Manager")
            };

            var accessToken = tokenService.GenerateAccessToken(claims);
            var refreshToken = tokenService.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7);

            userContext.SaveChanges();

            return Ok(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });

            //hard coded user below
            //if (user.UserName == "johndoe" && user.Password == "def@123")
            //{
            //    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenSecretKey"]));
            //    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            //    var tokeOptions = new JwtSecurityToken(
            //        issuer: "http://localhost:44359",
            //        audience: "http://localhost:4200",
            //        expires: DateTime.Now.AddMinutes(5),
            //        signingCredentials: signinCredentials
            //    );
            //    var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            //    return Ok(new { Token = tokenString });
            //}
            //else
            //{
            //    return Unauthorized();
            //}
        }
    }
}
