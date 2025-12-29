using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeMart.Server.DTOs
{
    public class OrderDto
    {
        public decimal Amount { get; set; }
        public DateTime OrderDate { get; set; }
        public bool IsCompleted { get; set; } = false;
    }
}
