using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeMart.Server.DTOs
{
    public class TransactionDto
    {
        public int Id { get; set; }
        public string? TransactionId { get; set; }
        public DateTime TransactionDateTime { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public decimal Amount { get; set; }
        public TransactionStatus Status { get; set; }
    }
}
