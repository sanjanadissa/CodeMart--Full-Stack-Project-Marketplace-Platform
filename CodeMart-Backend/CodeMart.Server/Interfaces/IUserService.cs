using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByEmailAsync(string email);
        Task<List<User>> GetAllUsersAsync();
        Task<User?> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(int id, User user);
        Task<bool> DeleteUserAsync(int id);
        Task<bool> AddProjectToWishlistAsync(int userId, int projectId);
        Task<bool> RemoveProjectFromWishlistAsync(int userId, int projectId);
        Task<List<Project>> GetWishlistAsync(int userId);
        Task<bool> AddToCartAsync(int userId, int projectId);
        Task<bool> RemoveProjectFromCartAsync(int userId, int projectId);
        Task<bool> BuyProjectAsync(int userId, int projectId);
        Task<List<Project>> GetCartAsync(int userId);
        Task<List<Project>> GetSellingProjectsAsync(int userId);
        Task<List<Project>> GetPurchasedProjectsAsync(int userId);
        Task<User?> ValidateUserCredentialsAsync(string email, string password);
        Task<Decimal?> GetTotalRevenueforUserAsync(int userId);
        Task<Decimal?> GetTotalRevenueforUserByMonthAsync(int userId, int month);
        Task<Order[]?> GetTotalSalesforUserAsync(int userId);
        Task<Order[]?> GetTotalSalesforUserByMonthAsync(int userId, int month);
    }
}
