using System.Linq;
using System.Security.Claims;


namespace Rannc.Data
{
    public static class ExtensionMethods
    {
        public static long GetUserID(this ClaimsPrincipal User)
        {
            return long.Parse(User.Claims.First(i => i.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").Value);
        }
    }
}