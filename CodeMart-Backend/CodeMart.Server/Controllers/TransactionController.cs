using CodeMart.Server.DTOs;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using CodeMart.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeMart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : Controller
    {
        private readonly ITransactionService _transactionService;
        private readonly IOrderService _orderService;

        public TransactionController(ITransactionService transactionService, IOrderService orderService)
        {
            _transactionService = transactionService;
            _orderService = orderService;
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTransactionById(int id)
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            var dto = new TransactionDto
            {
                Id = transaction.Id,
                TransactionId = transaction.TransactionId,
                TransactionDateTime = transaction.TransactionDateTime,
                PaymentMethod = transaction.PaymentMethod,
                Amount = transaction.Amount,
                Status = transaction.Status
            };
            return Ok(dto);
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllTransactions()
        {
            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Only administrators can view all transactions.");
            }

            var transactions = await _transactionService.GetAllTransactionsAsync();
            if (transactions == null || transactions.Count == 0)
            {
                return Ok(new List<TransactionDto>());
            }

            var dtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                TransactionId = t.TransactionId,
                TransactionDateTime = t.TransactionDateTime,
                PaymentMethod = t.PaymentMethod,
                Amount = t.Amount,
                Status = t.Status
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("status")]
        [Authorize]
        public async Task<IActionResult> GetTransactionsByStatus([FromQuery] TransactionStatus status)
        {
            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Only administrators can filter transactions by status.");
            }

            var transactions = await _transactionService.GetTransactionsByStatusAsync(status);
            if (transactions == null || transactions.Count == 0)
            {
                return Ok(new List<TransactionDto>());
            }

            var dtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                TransactionId = t.TransactionId,
                TransactionDateTime = t.TransactionDateTime,
                PaymentMethod = t.PaymentMethod,
                Amount = t.Amount,
                Status = t.Status
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("order/{orderId}")]
        [Authorize]
        public async Task<IActionResult> GetTransactionByOrderId(int orderId)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var transaction = await _transactionService.GetTransactionByOrderIdAsync(orderId);
            if (transaction == null)
            {
                return NotFound();
            }

            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (order.BuyerId != currentUserId && !isAdmin)
            {
                return Forbid("You can only view transactions for your own orders.");
            }

            var dto = new TransactionDto
            {
                Id = transaction.Id,
                TransactionId = transaction.TransactionId,
                TransactionDateTime = transaction.TransactionDateTime,
                PaymentMethod = transaction.PaymentMethod,
                Amount = transaction.Amount,
                Status = transaction.Status
            };
            return Ok(dto);
        }


        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> CreateTransaction([FromQuery] int orderId, [FromBody] TransactionDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Bad Request.");
            }

            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var order = await _orderService.GetOrderByIdAsync(orderId);
            if (order == null)
            {
                return NotFound($"Order with ID {orderId} not found.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (order.BuyerId != currentUserId && !isAdmin)
            {
                return Forbid("You can only create transactions for your own orders.");
            }

            var transaction = new Transaction
            {
                OrderId = orderId,
                TransactionId = dto.TransactionId,
                TransactionDateTime = DateTime.UtcNow,
                PaymentMethod = dto.PaymentMethod,
                Amount = dto.Amount,
                Status = dto.Status
            };

            var createdTransaction = await _transactionService.CreateTransactionAsync(transaction);
            if (createdTransaction == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new TransactionDto
            {
                Id = createdTransaction.Id,
                TransactionId = createdTransaction.TransactionId,
                TransactionDateTime = createdTransaction.TransactionDateTime,
                PaymentMethod = createdTransaction.PaymentMethod,
                Amount = createdTransaction.Amount,
                Status = createdTransaction.Status
            };
            return CreatedAtAction(
                nameof(GetTransactionById),
                new { id = createdTransaction.Id },
                dtoOut
            );
        }


        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Only administrators can delete transactions.");
            }

            var result = await _transactionService.DeleteTransactionAsync(id);
            if (!result)
            {
                return StatusCode(500, "Internal Server Error.");
            }
            return Ok($"Deleted Transaction {id}");
        }

        [HttpPut("process/{id}")]
        [Authorize]
        public async Task<IActionResult> ProcessPayment(int id, [FromQuery] TransactionStatus newStatus)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Only administrators can process payments.");
            }

            var transaction = await _transactionService.ProcessPaymentAsync(id, newStatus);
            if (transaction == null)
            {
                return NotFound($"Transaction with ID {id} not found.");
            }

            var dto = new TransactionDto
            {
                Id = transaction.Id,
                TransactionId = transaction.TransactionId,
                TransactionDateTime = transaction.TransactionDateTime,
                PaymentMethod = transaction.PaymentMethod,
                Amount = transaction.Amount,
                Status = transaction.Status
            };
            return Ok(dto);
        }

        [HttpGet("success/{id}")]
        [Authorize]
        public async Task<IActionResult> IsTransactionSuccessful(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var transaction = await _transactionService.GetTransactionByIdAsync(id);
            if (transaction == null)
            {
                return NotFound($"Transaction with ID {id} not found.");
            }

            var order = await _orderService.GetOrderByIdAsync(transaction.OrderId);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (order.BuyerId != currentUserId && !isAdmin)
            {
                return Forbid("You can only check status of transactions for your own orders.");
            }

            var isSuccessful = await _transactionService.IsTransactionSuccessfulAsync(id);
            return Ok(new { isSuccessful = isSuccessful });
        }
    }
}
