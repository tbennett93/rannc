using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Rannc.Models;

namespace Rannc.Services
{
    public interface IAuthRepository
    {
        Task<LoginModel> Login(string username, string password);
        Task Register(string username, string password);
    }
}
