using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Rannc.Data;
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
        private readonly ILogger<TokenController> _iLogger;

        public TokenController(UserContext userContext, ITokenService tokenService, ILogger<TokenController> iLogger)
        {
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            this._iLogger = iLogger ?? throw new ArgumentNullException(nameof(_iLogger));

        }


        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh(TokenApiModel tokenApiModel)
        {
            _iLogger.LogInformation("POST Token.refresh called");

            if (tokenApiModel is null)
            {
                _iLogger.LogWarning("Bad/empty request");
                return BadRequest("Invalid client request");
            }

            string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;
            var principal = _tokenService.GetPrincipalFromToken(accessToken);
            var userId = this.User.GetUserId(); //this is mapped to the Name claim by default
            
            _iLogger.LogWarning(userId == null
                ? "Unable to retrieve user Id from claim"
                : "user Id retrieved from claim");

            var user = _userContext.LoginModel.SingleOrDefault(u => u.Id == userId);
            _iLogger.LogWarning(user == null
                ? "Unable to retrieve user from db"
                : "user retrieved from db");

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                _iLogger.LogWarning("Could not refresh token. Mismatching or expired refresh.");
                return BadRequest("Invalid client request");
            }

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();
            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = _tokenService.RefreshTokenTime;
            _iLogger.LogInformation("Refresh token established");
            _userContext.SaveChanges();
            _iLogger.LogInformation("Refresh token saved to db");

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
            _iLogger.LogInformation("POST Token.revoke called");

            var username = User.Identity.Name;
            if (username == null)
            {
                _iLogger.LogWarning("user could not be found identity");
            }
            else
            {
                _iLogger.LogInformation("user identity found");
            }
            var user = _userContext.LoginModel.SingleOrDefault(u => u.UserName == username);
            if (user == null)
            {
                _iLogger.LogWarning("user could not be found in db"); 
                return BadRequest();
            }
            _iLogger.LogInformation("user found in db");

            user.RefreshToken = null;
            _userContext.SaveChanges();
            _iLogger.LogInformation("token revoked from db");
            return NoContent();
        }
    }
}
