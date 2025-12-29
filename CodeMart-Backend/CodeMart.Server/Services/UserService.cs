using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace CodeMart.Server.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(AppDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            try
            {
                return await _context.Users
                    .Include(u => u.SellingProjects)
                    .FirstOrDefaultAsync(u => u.Id == id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user {UserId}", id);
                throw;
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user with {Email}", email);
                throw;
            }
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            try
            {
                return await _context.Users.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all users");
                throw;
            }
        }

        public async Task<User?> CreateUserAsync(User user)
        {
            try
            {
                // Only hash password if provided (normal signup)
                if (!string.IsNullOrWhiteSpace(user.Password))
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }
                else
                {
                    // Google signup: Assign random value or empty
                    user.Password = Guid.NewGuid().ToString(); // no password stored
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user");
                throw;
            }
        }


        public async Task<User?> UpdateUserAsync(int id, User user)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(id);

                if (existingUser == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found for update", id);
                    return null;
                }

                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.Email = user.Email;
                existingUser.Occupation = user.Occupation;
                existingUser.CompanyName = user.CompanyName;
                existingUser.ProfilePicture = user.ProfilePicture;
                existingUser.IsAdmin = user.IsAdmin;

                if (!string.IsNullOrWhiteSpace(user.Password))
                {
                    existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }

                await _context.SaveChangesAsync();

                return existingUser;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user {UserId}", user.Id);
                throw;
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found for deletion", id);
                    throw new Exception("User not found");
                }
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user {UserId}", id);
                throw;
            }
        }

        public async Task<List<Project>> GetSellingProjectsAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                .Include(u => u.SellingProjects)
                .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return new List<Project>();
                }

                return user?.SellingProjects;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "cant get selling projects");
                throw;
            }

        }

        public async Task<bool> AddProjectToWishlistAsync(int userId, int projectId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.WishlistedProjects) // load wishlist
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return false;
                }

                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
                    return false;
                }

                if (!user.WishlistedProjects.Any(p => p.Id == projectId))
                {
                    user.WishlistedProjects.Add(project);
                    await _context.SaveChangesAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding project {ProjectId} to wishlist for user {UserId}", projectId, userId);
                throw;
            }
        }


        public async Task<bool> RemoveProjectFromWishlistAsync(int userId, int projectId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.WishlistedProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return false;
                }

                var project = user.WishlistedProjects.FirstOrDefault(p => p.Id == projectId);
                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found in wishlist for user {UserId}", projectId, userId);
                    return false;
                }

                user.WishlistedProjects.Remove(project);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Removed project {ProjectId} from wishlist for user {UserId}", projectId, userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing project {ProjectId} from wishlist for user {UserId}", projectId, userId);
                throw;
            }
        }

        public async Task<List<Project>> GetWishlistAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.WishlistedProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return new List<Project>();
                }
                return user.WishlistedProjects;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error getting wishlist from user {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> AddToCartAsync(int userId, int projectId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.CartProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return false;
                }

                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
                    return false;
                }

                if (!user.CartProjects.Any(p => p.Id == projectId))
                {
                    user.CartProjects.Add(project);
                    await _context.SaveChangesAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding project {ProjectId} to wishlist for user {UserId}", projectId, userId);
                throw;
            }
        }

        public async Task<bool> RemoveProjectFromCartAsync(int userId, int projectId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.CartProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return false;
                }

                var project = user.CartProjects.FirstOrDefault(p => p.Id == projectId);
                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found in Cart for user {UserId}", projectId, userId);
                    return false;
                }

                user.CartProjects.Remove(project);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Removed project {ProjectId} from cart for user {UserId}", projectId, userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing project {ProjectId} from cart for user {UserId}", projectId, userId);
                throw;
            }
        }

        public async Task<bool> BuyProjectAsync(int userId, int projectId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var added = false;
                var user = await _context.Users
                    .Include(u => u.BoughtProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return false;
                }

                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    _logger.LogWarning("Project with ID {ProjectId} not found", projectId);
                    return false;
                }

                if (!user.BoughtProjects.Any(p => p.Id == projectId))
                {
                    user.BoughtProjects.Add(project);
                }

                await _context.SaveChangesAsync();
                var order = new Order
                {
                    Amount = project.Price,
                    OrderDate = DateTime.UtcNow,
                    BuyerId = userId,
                    ProjectId = projectId,
                    IsCompleted = true,
                    Buyer = user,
                    Project = project
                };

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error buying project {ProjectId} for user {UserId}", projectId, userId);
                throw;
            }
        }

        public async Task<List<Project>> GetCartAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.CartProjects)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return new List<Project>();
                }
                return user.CartProjects;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error getting cart from user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<Project>> GetPurchasedProjectsAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                      .Include(u => u.BoughtProjects)
                      .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return new List<Project>();
                }
                return user.BoughtProjects;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error getting wishlist from user {UserId}", userId);
                throw;
            }
        }

        public async Task<User?> ValidateUserCredentialsAsync(string email, string password)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null)
                {
                    _logger.LogWarning("No user found with email {Email}", email);
                    return null;
                }

                var passwordMatches = BCrypt.Net.BCrypt.Verify(password, user.Password);
                if (!passwordMatches)
                {
                    _logger.LogWarning("Invalid password attempt for user {Email}", email);
                    return null;
                }

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error validating credentials for {Email}", email);
                throw;
            }
        }

        public async Task<Decimal?> GetTotalRevenueforUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                      .Include(u => u.SellingProjects)
                      .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    _logger.LogWarning("No user found with id {id}", userId);
                    return null;
                }

                decimal totalRevenue = 0;

                foreach (var project in user.SellingProjects)
                {
                    var projectOrders = await _context.Orders
                        .Where(o => o.ProjectId == project.Id && o.IsCompleted)
                        .CountAsync();
                    
                    totalRevenue += projectOrders * project.Price;
                }

                return totalRevenue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total revenue for user {userId}", userId);
                throw;
            }
        }

        public async Task<Decimal?> GetTotalRevenueforUserByMonthAsync(int userId, int month)
        {
            try
            {
                var user = await _context.Users
                      .Include(u => u.SellingProjects)
                      .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    _logger.LogWarning("No user found with id {id}", userId);
                    return null;
                }

                decimal totalRevenue = 0;

                foreach (var project in user.SellingProjects)
                {
                    var projectOrders = await _context.Orders
                        .Where(o => o.ProjectId == project.Id && o.IsCompleted && o.OrderDate.Month == month)
                        .CountAsync();
                    
                    totalRevenue += projectOrders * project.Price;
                }

                return totalRevenue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total revenue for user {userId}", userId);
                throw;
            }
        }

        public async Task<Order[]?> GetTotalSalesforUserAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                      .Include(u => u.SellingProjects)
                      .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    _logger.LogWarning("No user found with id {id}", userId);
                    return null;
                }

                var totalSales = new List<Order>();

                foreach (var project in user.SellingProjects)
                {
                    var projectOrders = await _context.Orders
                        .Where(o => o.ProjectId == project.Id && o.IsCompleted)
                        .Include(o => o.Project)
                        .Include(o => o.Buyer)
                        .Include(o => o.Transaction)
                        .ToListAsync();
                    
                    totalSales.AddRange(projectOrders);
                }

                return totalSales.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total sales for user {userId}", userId);
                throw;
            }
        }

        public async Task<Order[]?> GetTotalSalesforUserByMonthAsync(int userId, int month)
        {
            try
            {
                var user = await _context.Users
                      .Include(u => u.SellingProjects)
                      .FirstOrDefaultAsync(u => u.Id == userId);
                if (user == null)
                {
                    _logger.LogWarning("No user found with id {id}", userId);
                    return null;
                }

                var totalSales = new List<Order>();

                foreach (var project in user.SellingProjects)
                {
                    var projectOrders = await _context.Orders
                        .Where(o => o.ProjectId == project.Id && o.IsCompleted && o.OrderDate.Month == month)
                        .Include(o => o.Project)
                        .Include(o => o.Buyer)
                        .Include(o => o.Transaction)
                        .ToListAsync();
                    
                    totalSales.AddRange(projectOrders);
                }

                return totalSales.ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting total sales for user {userId}", userId);
                throw;
            }
        }
    }
}
