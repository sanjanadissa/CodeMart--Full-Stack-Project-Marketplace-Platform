using CodeMart.Server.Data;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CodeMart.Server.Services
{
    public class TransactionService : ITransactionService
    {

        private readonly AppDbContext _context;
        private readonly ILogger<TransactionService> _logger;

        public TransactionService(AppDbContext context, ILogger<TransactionService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            try
            {
                return await _context.Transactions.FindAsync(id);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user {UserId}", id);
                throw;
            }
        }

        public async Task<List<Transaction>> GetAllTransactionsAsync()
        {
            try
            {
                return await _context.Transactions.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all transactions");
                throw;
            }
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transaction)
        {
            try
            {
                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync();
                return transaction;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating Transaction");
                throw;
            }
        }

        public async Task<Transaction?> UpdateTransactionAsync(Transaction transaction)
        {
            try
            {
                var existingTransaction = await _context.Transactions.FindAsync(transaction.Id);
                if (existingTransaction == null)
                {
                    _logger.LogError("Cant find transaction with id {transactionId} for update", transaction.Id);
                    return null;
                }
                existingTransaction.OrderId = transaction.OrderId;
                existingTransaction.TransactionId = transaction.TransactionId;
                existingTransaction.TransactionDateTime = transaction.TransactionDateTime;
                existingTransaction.PaymentMethod = transaction.PaymentMethod;
                existingTransaction.TransactionId = transaction.TransactionId;
                existingTransaction.Amount = transaction.Amount;
                existingTransaction.Status = transaction.Status;

                await _context.SaveChangesAsync();
                return existingTransaction;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating transaction {TransactionId}", transaction.Id);
                throw;
            }
        }

        public async Task<bool> DeleteTransactionAsync(int id)
        {
            try
            {
                var transaction = await _context.Transactions.FindAsync(id);
                if (transaction == null)
                {
                    _logger.LogError("Cant find transaction with id {transactionId} for delete", id);
                    return false;
                }
                _context.Transactions.Remove(transaction);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting transaction {TransactionId}", id);
                throw;
            }
        }

        public async Task<List<Transaction>> GetTransactionsByStatusAsync(TransactionStatus status)
        {
            try
            {
                return await _context.Transactions
                    .Where(t => t.Status == status)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transactions by status {Status}", status);
                throw;
            }
        }

        public async Task<Transaction?> ProcessPaymentAsync(int transactionId, TransactionStatus newStatus)
        {
            try
            {
                var transaction = await _context.Transactions
                    .Include(t => t.Order)
                    .FirstOrDefaultAsync(t => t.Id == transactionId);

                if (transaction == null)
                {
                    _logger.LogWarning("Transaction with ID {TransactionId} not found", transactionId);
                    return null;
                }

                transaction.Status = newStatus;

                if (newStatus == TransactionStatus.Success && transaction.Order != null)
                {
                    transaction.Order.IsCompleted = true;
                }

                await _context.SaveChangesAsync();
                return transaction;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing transaction {TransactionId}", transactionId);
                throw;
            }
        }

        public async Task<Transaction?> GetTransactionByOrderIdAsync(int orderId)
        {
            try
            {
                return await _context.Transactions
                    .FirstOrDefaultAsync(t => t.OrderId == orderId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting transaction by Order Id");
                throw;
            }
        }

        public async Task<bool> IsTransactionSuccessfulAsync(int transactionId)
        {
            try
            {
                var transaction = await _context.Transactions.FindAsync(transactionId);
                if (transaction == null)
                {
                    _logger.LogWarning("Transaction with ID {TransactionId} not found", transactionId);
                    return false;
                }
                return transaction.Status == TransactionStatus.Success;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking transaction successful");
                throw;
            }
        }
    }
}
