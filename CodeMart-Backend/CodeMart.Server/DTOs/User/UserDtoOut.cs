using CodeMart.Server.DTOs.Project;
using CodeMart.Server.Models;

namespace CodeMart.Server.DTOs.User
{
    public class UserDtoOut
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string Email { get; set; }
        public string Occupation { get; set; }
        public string? CompanyName { get; set; }
        public string? ProfilePicture { get; set; }
        public bool IsAdmin { get; set; }
        public List<OrderDto> Orders { get; set; } = [];
        public int SellingProjectsCount { get; set; }
    }
}
