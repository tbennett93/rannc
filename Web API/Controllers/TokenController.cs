using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly UserContext _userContext;
        private readonly ITokenService _tokenService;
        public TokenController(UserContext userContext, ITokenService tokenService)
        {
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }


        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
            {
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;
            var principal = _tokenService.GetPrincipalFromToken(accessToken);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default
            var user = _userContext.LoginModel.SingleOrDefault(u => u.UserName == username);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                return BadRequest("Invalid client request");
            }

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = _tokenService.RefreshTokenTime;
            _userContext.SaveChanges();

            return new ObjectResult(new
            {
                accessToken = newAccessToken,
                refreshToken = newRefreshToken
            });
        }
        [HttpPost, Authorize]
        [Route("revoke")]
        public IActionResult Revoke()
        {
            var username = User.Identity.Name;
            var user = _userContext.LoginModel.SingleOrDefault(u => u.UserName == username);
            if (user == null) return BadRequest();
            user.RefreshToken = null;
            _userContext.SaveChanges();
            return NoContent();
        }
    }
}
