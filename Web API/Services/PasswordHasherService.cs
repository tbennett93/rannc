using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Rannc.Services
{
    public class PasswordHasherService : IPasswordHasherService
    {


        public byte[] GetSalt()
        {
            // generate a 128-bit salt using a secure PRNG
            byte[] salt = new byte[128 / 8];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(salt);
            return salt;
        }

        public string GetHashedSaltedPassword(string password, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }







    }
}