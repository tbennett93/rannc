using System;
using System.Linq;
using System.Security.Claims;


namespace Rannc.Data
{
    public static class ExtensionMethods
    {
        public static long? GetUserId(this ClaimsPrincipal User)
        {

            if (User == null)
                return null;

            var claim = User.Claims.FirstOrDefault(i =>
                i.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");

            if (claim == null) return null;

            var user = long.Parse(claim.Value);
            return user;


        }
    }
}