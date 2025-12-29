using CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface IReviewService
    {
        Task<Review?> GetReviewByIdAsync(int id);
        Task<List<Review>> GetAllReviewsAsync();
        Task<List<Review>> GetReviewsByProjectIdAsync(int projectId);
        Task<Review?> CreateReviewAsync(Review review);
        Task<Review?> UpdateReviewAsync(Review review);
        Task<bool> DeleteReviewAsync(int id);
        Task<bool> HasUserReviewedProjectAsync(int userId, int projectId);
    }
}
