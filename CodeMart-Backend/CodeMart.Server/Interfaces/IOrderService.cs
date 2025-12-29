using CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface IOrderService
    {
        Task<Order?> GetOrderByIdAsync(int id);
        Task<List<Order>> GetAllOrdersByUserIdOrderByDateAsync(int userId);
        Task<Order?> CreateOrderAsync(Order order);
        Task<bool> DeleteOrderAsync(int id);
        Task<bool> CompleteOrderAsync(int orderId);
        Task<int> GetOrderCountForProjectAsync(int projectId);
    }
}
