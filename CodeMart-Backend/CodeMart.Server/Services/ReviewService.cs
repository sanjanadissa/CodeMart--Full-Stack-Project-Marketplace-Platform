using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeMart.Server.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ReviewService> _logger;

        public ReviewService(AppDbContext context, ILogger<ReviewService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<Review?> GetReviewByIdAsync(int id)
        {
            try
            {
                return await _context.Reviews.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting review {Id}", id);
                throw;
            }
        }

        public async Task<List<Review>> GetAllReviewsAsync()
        {
            try
            {
                return await _context.Reviews.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all the reviews");
                throw;
            }
        }

        public async Task<List<Review>> GetReviewsByProjectIdAsync(int projectId)
        {
            try
            {
                var ReviewsList = await _context.Reviews
                    .Where(r => r.ProjectId == projectId)
                    .ToListAsync();

                return ReviewsList;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reviews by projectId {id}", projectId);
                throw;
            }

        }

        public async Task<Review?> CreateReviewAsync(Review review)
        {
            try
            {
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();
                return review;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Reiew");
                throw;
            }
        }

        public async Task<Review?> UpdateReviewAsync(Review review)
        {
            try
            {
                var existingReview = await _context.Reviews.FindAsync(review.Id);
                if (existingReview == null)
                {
                    _logger.LogError("Cant find transaction with id {id} for update", review.Id);
                    return null;
                }
                existingReview.Comment = review.Comment;
                existingReview.DateAdded = review.DateAdded;
                existingReview.Rating = review.Rating;

                await _context.SaveChangesAsync();
                return existingReview;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating Review {id}", review.Id);
                throw;
            }
        }

        public async Task<bool> DeleteReviewAsync(int id)
        {
            try
            {
                var review = await _context.Reviews.FindAsync(id);
                if (review == null)
                {
                    _logger.LogError("Cant find Review with id {id} for delete", id);
                    return false;
                }
                _context.Reviews.Remove(review);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Review {id}", id);
                throw;
            }
        }

        public async Task<bool> HasUserReviewedProjectAsync(int userId, int projectId)
        {
            try
            {
                var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.ProjectId == projectId && r.ReviewerId == userId);
                if (review == null)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching user review for project");
                throw;
            }
        }
    }
}
