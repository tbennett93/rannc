using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Rannc.Services
{
    public class TokenService : ITokenService
    {
        public DateTime RefreshTokenTime => DateTime.Now.AddDays(30);

        private readonly IConfiguration _configuration;
        private readonly ILogger<TokenService> _iLogger;
        public TokenService(IConfiguration configuration, ILogger<TokenService> iLogger)
        {
            _configuration = configuration;
            _iLogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));
        }
        public string GenerateAccessToken(IEnumerable<Claim> claims)
        {
            _iLogger.LogInformation("TokenService.GenerateAccessToken called");
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["TokenSecretKey"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "http://localhost:44359",
                audience: "http://localhost:4200",
                claims: claims,
                //expires: DateTime.Now.AddMinutes(1),
                expires: DateTime.Now.AddDays(90),
                signingCredentials: signinCredentials
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }
        public string GenerateRefreshToken()
        {
            _iLogger.LogInformation("TokenService.GenerateRefreshToken called");
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromToken(string token)
        {
            _iLogger.LogInformation("TokenService.GetPrincipalFromToken called");

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["TokenSecretKey"])),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                _iLogger.LogWarning("Invalid token, could not decode");
                throw new SecurityTokenException("Invalid token");
            }
            _iLogger.LogInformation("Token decoded. Returning claims principal");
            return principal;
        }

    }
}
