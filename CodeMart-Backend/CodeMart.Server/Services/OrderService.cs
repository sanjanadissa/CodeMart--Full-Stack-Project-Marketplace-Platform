using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeMart.Server.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OrderService> _logger;

        public OrderService(AppDbContext context, ILogger<OrderService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            try
            {
                return await _context.Orders.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Order {Id}", id);
                throw;
            }
        }

        public async Task<List<Order>> GetAllOrdersByUserIdOrderByDateAsync(int userId)
        {
            try
            {
                var orders = await _context.Orders
                    .Where(o => o.BuyerId == userId)
                    .OrderBy(o => o.OrderDate)
                    .ToListAsync();

                return orders;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting Orders for user {Id}", userId);
                throw;
            }
        }

        public async Task<Order?> CreateOrderAsync(Order order)
        {
            try
            {
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return order;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creting Order");
                throw;
            }
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            try
            {
                var order = await _context.Orders.FindAsync(id);
                if (order == null)
                {
                    _logger.LogError("Can't find order with id {id} for delete", id);
                    return false;
                }
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting Order {Id}", id);
                throw;
            }
        }

        public async Task<bool> CompleteOrderAsync(int orderId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                {
                    _logger.LogError("Can't find order with id {id} for delete", orderId);
                    return false;
                }
                order.IsCompleted = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error Completing Order {Id}", orderId);
                throw;
            }
        }

        public async Task<int> GetOrderCountForProjectAsync(int projectId)
        {
            try
            {
                return await _context.Orders.CountAsync(o => o.ProjectId == projectId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order count for project {Id}", projectId);
                throw;
            }
        }
    }
}
