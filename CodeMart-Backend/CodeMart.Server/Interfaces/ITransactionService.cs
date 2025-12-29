using CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface ITransactionService
    {
        Task<Transaction?> GetTransactionByIdAsync(int id);
        Task<List<Transaction>> GetAllTransactionsAsync();
        Task<Transaction> CreateTransactionAsync(Transaction transaction);
        Task<Transaction?> UpdateTransactionAsync(Transaction transaction);
        Task<bool> DeleteTransactionAsync(int id);
        Task<List<Transaction>> GetTransactionsByStatusAsync(TransactionStatus status);
        Task<Transaction> ProcessPaymentAsync(int transactionId, TransactionStatus newStatus);
        Task<Transaction?> GetTransactionByOrderIdAsync(int orderId);
        Task<bool> IsTransactionSuccessfulAsync(int transactionId);
    }
}
