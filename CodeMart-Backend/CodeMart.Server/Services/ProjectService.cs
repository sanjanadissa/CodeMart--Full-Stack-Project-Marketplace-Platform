using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.EntityFrameworkCore;

namespace CodeMart.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ProjectService> _logger;

        public ProjectService(AppDbContext context, ILogger<ProjectService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Project?> GetProjectByIdAsync(int id)
        {
            try
            {
                return await _context.Projects
                .Include(p => p.Review)
                    .ThenInclude(r => r.Reviewer)
                .FirstOrDefaultAsync(p => p.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Project {Id}", id);
                throw;
            }
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            try
            {
                return await _context.Projects
                    .Include(p => p.Owner)
                    .Include(p => p.Review)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all the Projects");
                throw;
            }
        }

        public async Task<List<Project>> GetProjectsMoreThanRatingAsync(int rating)
        {
            try
            {
                var Projects = await _context.Projects
                    .Include(p => p.Review)
                    .Where(p => p.Review.Any() && p.Review.Average(r => r.Rating) > rating)
                    .Include(p => p.Owner)
                    .ToListAsync();
                return Projects;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all the Projects more than rating {rating}", rating);
                throw;
            }
        }

        public async Task<List<Project>> GetProjectsForGivenCategoryAsync(Category category)
        {
            try
            {
                return await _context.Projects
                    .Where(p => p.Category == category)
                    .Include(p => p.Owner)
                    .Include(p => p.Review)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Projects more than category {cat}", category);
                throw;
            }
        }

        public async Task<List<Project>> GetProjectsBetweenPriceAsync(decimal lowPrice, decimal highPrice)
        {
            try
            {
                return await _context.Projects
                .Where(p => p.Price >= lowPrice && p.Price <= highPrice)
                .Include(p => p.Owner)
                .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Projects between prices {price1} {price2}", lowPrice, highPrice);
                throw;
            }

        }

        public async Task<List<User>> GetBuyersAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects
                .Include(p => p.Buyers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

                return project?.Buyers ?? new List<User>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting buyers of project {id}", projectId);
                throw;
            }


        }

        public async Task<List<Review>> GetReviewesAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects
                .Include(p => p.Review)
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.Id == projectId);

                return project?.Review ?? new List<Review>();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting reviews of project {id}", projectId);
                throw;
            }
        }

        public async Task<List<Project>> GetProjectByPermissionAsync(Permissions permission)
        {
            try
            {
                return await _context.Projects
                    .Where(p => p.Permission == permission)
                    .Include(p => p.Owner)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Projects more than permission {cat}", permission);
                throw;
            }
        }

        public async Task<Project?> CreateProjectAsync(Project project)
        {
            try
            {
                _context.Projects.Add(project);
                await _context.SaveChangesAsync();
                return project;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Project");
                throw;
            }
        }


        public async Task<Project?> UpdateProjectAsync(Project project)
        {
            try
            {
                var existingProject = await _context.Projects.FindAsync(project.Id);
                if (existingProject == null)
                {
                    _logger.LogError("Cannot find project with id {ProjectId} for update", project.Id);
                    return null;
                }

                existingProject.Name = project.Name;
                existingProject.Category = project.Category;
                existingProject.Description = project.Description;
                existingProject.Price = project.Price;
                existingProject.ProjectUrl = project.ProjectUrl;
                existingProject.VideoUrl = project.VideoUrl;
                existingProject.Permission = project.Permission;
                existingProject.ImageUrls = project.ImageUrls;
                existingProject.PrimaryLanguages = project.PrimaryLanguages;
                existingProject.SecondaryLanguages = project.SecondaryLanguages;
                existingProject.Features = project.Features;

                await _context.SaveChangesAsync();
                return existingProject;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project {ProjectId}", project.Id);
                throw;
            }
        }


        public async Task<bool> DeleteProjectAsync(int id)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    _logger.LogError("Cant find project with id {id} for delete", id);
                    return false;
                }
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting project {id}", id);
                throw;
            }
        }

        public async Task<bool> ApproveProjectAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    _logger.LogError("Cant find project with id {id} for approval", projectId);
                    return false;
                }
                project.Permission = Permissions.Approved;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving project {id}", projectId);
                throw;
            }
        }

        public async Task<bool> RejectProjectAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    _logger.LogError("Cant find project with id {id} for reject", projectId);
                    return false;
                }
                project.Permission = Permissions.Rejected;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving project {id}", projectId);
                throw;
            }
        }

        public async Task<List<Project>> SearchProjectAsync(string name)
        {
            try
            {
                var projects = await _context.Projects
                    .Where(p => EF.Functions.ILike(p.Name, $"%{name}%"))
                    .Include(p => p.Owner)
                    .Include(r => r.Review )
                    .ToListAsync();
                return projects;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching name");
                throw;
            }   

        }

        public async Task<List<Project>> GetProjectsSortedByPriceAsync(bool ascending = true)
        {
            try
            {
                var projects = _context.Projects.AsQueryable();

                projects = ascending
                    ? projects.OrderBy(p => p.Price)
                    : projects.OrderByDescending(p => p.Price);
                return await projects.Include(p => p.Owner).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Projects sorted");
                throw;
            }
        }

        public async Task<bool> HasUserPurchasedProjectAsync(int userId, int projectId)
        {
            try
            {
                var project = await _context.Projects
                .Include(p => p.Buyers)
                .FirstOrDefaultAsync(p => p.Id == projectId);

                if (project == null)
                {
                    _logger.LogError("Cant find project with id {id} for reject", projectId);
                    return false;
                }

                return project.Buyers.Any(u => u.Id == userId);
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checkng user {id1} bought project {id2}", userId, projectId);
                throw;
            }
        }
        public async Task<bool> IsProjectOwnedByUserAsync(int userId, int projectId)
        {
            try
            {
                var OwnerId = await _context.Projects
                .Where(p => p.Id == projectId)
                .Select(p => p.OwnerId)
                .FirstOrDefaultAsync();

                if (OwnerId == 0)
                {
                    _logger.LogError("Cannot find project with id {ProjectId}", projectId);
                    return false;
                }

                return OwnerId == userId;
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checkng user {id1} is owner of project {id2}", userId, projectId);
                throw;
            }
        }

        public async Task<Decimal> GetTotalRevenueForProjectAsync(int projectId)
        {
            try
            {
                var project = await _context.Projects
                .Include(p => p.Orders)
                .FirstOrDefaultAsync(p => p.Id == projectId);

                decimal totalRevenue = (project?.Orders.Count ?? 0) * project?.Price ?? 0;

                return totalRevenue;
            }

            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting revenue for project {id}", projectId);
                throw;
            }
        }

        public async Task<Decimal> GetTotalRevenueForProjectByMonthAsync(int projectId, int month)
        {
            try
            {
                var project = await _context.Projects
                .Include(p => p.Orders)
                .FirstOrDefaultAsync(p => p.Id == projectId);

                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
                    return 0;
                }

                var monthlyOrders = project.Orders
                    .Where(o => o.OrderDate.Month == month && o.IsCompleted)
                    .ToList();

                decimal totalRevenue = monthlyOrders.Count * project.Price;

                return totalRevenue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting revenue for project {id} in month {month}", projectId, month);
                throw;
            }
        }

        public async Task<List<Project>> GetFeaturedProjectsAsync(int count)
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Owner)
                    .Include(p => p.Review)
                    .Where(p => p.Permission == Permissions.Approved || p.Permission == Permissions.Pending)
                    .ToListAsync();

                var projectsWithRatings = projects
                    .Select(p => new
                    {
                        Project = p,
                        AverageRating = p.Review != null && p.Review.Count > 0
                            ? Math.Round(p.Review.Average(r => r.Rating), 1)
                            : 0
                    })
                    .OrderByDescending(x => x.AverageRating)
                    .ThenByDescending(x => x.Project.UploadDate)
                    .Take(count)
                    .Select(x => x.Project)
                    .ToList();

                return projectsWithRatings;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting featured projects");
                throw;
            }
        }

        public async Task<double?> GetOwnerRating(int id)
        {
            try
            {
                var projectsWithRatings = await _context.Projects
                    .Where(p => p.OwnerId == id)
                    .Include(p => p.Review)                   
                    .Select(p => new
                    {
                        Project = p,
                        AverageRating = p.Review.Any()
                            ? Math.Round(p.Review.Average(r => r.Rating), 1)
                            : 0
                    })
                    .ToListAsync();

                double rating = projectsWithRatings.Any()
                    ? Math.Round(projectsWithRatings.Average(p => p.AverageRating), 1)
                    : 0;
                return rating;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user rating");
                throw;
            }
        }
    }
}
