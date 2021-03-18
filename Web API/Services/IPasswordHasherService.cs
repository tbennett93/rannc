using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Rannc.Services
{
    public interface IPasswordHasherService
    {
        byte[] GetSalt();
        string GetHashedSaltedPassword(string password, byte[] salt);
    }
}