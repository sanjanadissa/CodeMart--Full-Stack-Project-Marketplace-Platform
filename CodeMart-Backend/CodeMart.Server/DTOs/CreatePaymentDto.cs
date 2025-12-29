namespace CodeMart.Server.DTOs
{
    public class CreatePaymentDto
    {
        public decimal Amount { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }
    }
}
