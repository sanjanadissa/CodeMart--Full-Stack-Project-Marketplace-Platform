using CodeMart.CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeMart.Server.Models
{
    [Table("transactions", Schema = "public")]
    public class Transaction
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        public string? TransactionId { get; set; }

        [Required]
        public DateTime TransactionDateTime { get; set; }

        [Required]
        public PaymentMethod PaymentMethod { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public TransactionStatus Status { get; set; }
    }
}
