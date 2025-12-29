using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CodeMart.CodeMart.Server.Models
{
    [Table("users", Schema = "public")]
    public class User
    {     
        [Key]
        public int Id { get; set; }

        [Required] 
        public string FirstName { get; set; }

        public string? LastName { get; set; }

        public string? FullName 
        { 
            get 
            {
                if (string.IsNullOrWhiteSpace(LastName))
                    return FirstName;
                return $"{FirstName} {LastName}";
            }
        }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Password { get; set; }

        public bool IsAdmin { get; set; } = false;

        [Required]
        public string? Occupation { get; set; }

        public string? CompanyName { get; set; }

        public string? ProfilePicture { get; set; }

        [InverseProperty("Owner")]
        public List<Project> SellingProjects { get; set; } = [];

        [InverseProperty("Buyers")]
        public List<Project> BoughtProjects { get; set; } = [];

        [InverseProperty("WishlistedBy")]
        public List<Project> WishlistedProjects { get; set; } = [];

        [InverseProperty("CartedBy")]
        public List<Project> CartProjects { get; set; } = [];

        [InverseProperty("Reviewer")]
        public List<Review> Reviews { get; set; } = [];

        [InverseProperty("Buyer")]
        public List<Order> Orders { get; set; } = [];

    }
}
