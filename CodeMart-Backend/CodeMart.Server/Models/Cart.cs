using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeMart.Server.Models
{
    public class Cart
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public Category Category { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required]
        public string ProjectUrl { get; set; }

        public string? VideoUrl { get; set; }

        [Required]
        public DateTime UploadDate { get; set; }

        [Required]
        public Permissions Permission { get; set; } = Permissions.Pending;

        [Required]
        public List<string> ImageUrls { get; set; } = new List<string>();

        [Required]
        public string PrimaryLanguage { get; set; }

        [Required]
        public List<string>? SecondaryLanguages { get; set; } = new List<string>();

        public int OwnerId { get; set; }
        [ForeignKey("OwnerId")]
        public required User Owner { get; set; }

        public List<User> Buyers { get; set; } = [];

        public List<Review> Review { get; set; } = [];

        public List<User> WishlistedBy { get; set; } = [];

        public List<Order> Orders { get; set; } = [];
    }
}
