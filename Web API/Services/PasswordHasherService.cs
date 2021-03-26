using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.Extensions.Logging;

namespace Rannc.Services
{
    public class PasswordHasherService : IPasswordHasherService
    {

        private readonly ILogger<PasswordHasherService> _ilogger;

        public PasswordHasherService(ILogger<PasswordHasherService> iLogger)
        {
            this._ilogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));
        }
        public byte[] GetSalt()
        {
            _ilogger.LogInformation("PasswordHasher.GetSalt called");
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);
            return salt;
        }

        public string GetHashedSaltedPassword(string password, byte[] salt)
        {
            _ilogger.LogInformation("PasswordHasher.GetSaltedPassword called");
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }







    }
}