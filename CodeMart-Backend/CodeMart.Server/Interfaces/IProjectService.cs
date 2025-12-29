using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task<Project?> GetProjectByIdAsync(int id);
        Task<List<Project>> GetProjectsMoreThanRatingAsync(int rating);
        Task<List<Project>> GetProjectsForGivenCategoryAsync(Category category);
        Task<List<Project>> GetProjectsBetweenPriceAsync(decimal LowPrice, decimal HighPrice);
        Task<List<User>> GetBuyersAsync(int projectId);
        Task<List<Review>> GetReviewesAsync(int projectId);
        Task<List<Project>> GetProjectByPermissionAsync(Permissions permission);
        Task<Project?> CreateProjectAsync(Project project);
        Task<Project?> UpdateProjectAsync(Project project);
        Task<bool> DeleteProjectAsync(int id);
        Task<bool> ApproveProjectAsync(int projectId);
        Task<bool> RejectProjectAsync(int projectId);
        Task<List<Project>> SearchProjectAsync(string name);
        Task<List<Project>> GetProjectsSortedByPriceAsync(bool ascending = true);
        Task<bool> HasUserPurchasedProjectAsync(int userId, int projectId);
        Task<bool> IsProjectOwnedByUserAsync(int userId, int projectId);
        Task<Decimal> GetTotalRevenueForProjectAsync(int projectId);
        Task<Decimal> GetTotalRevenueForProjectByMonthAsync(int projectId, int month);
        Task<List<Project>> GetFeaturedProjectsAsync(int count);
        Task<double?> GetOwnerRating(int id);
    }
}
