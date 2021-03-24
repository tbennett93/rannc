using System.Threading.Tasks;

namespace Rannc.Services
{
    public interface IUserRepository
    {
        Task<long> FindUserIdFromName(string userName);
    }
}