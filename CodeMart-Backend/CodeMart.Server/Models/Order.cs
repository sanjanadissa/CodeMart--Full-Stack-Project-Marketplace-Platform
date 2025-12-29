using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CodeMart.Server.Models
{
    [Table("orders", Schema = "public")]
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public int BuyerId { get; set; }
        [ForeignKey("BuyerId")]
        public required User Buyer { get; set; }

        public int ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public required Project Project { get; set; }

        [InverseProperty("Order")]
        public Transaction Transaction { get; set; }

        public bool IsCompleted { get; set; } = false;
    }
}
