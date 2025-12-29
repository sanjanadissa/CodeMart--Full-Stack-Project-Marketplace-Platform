using CodeMart.CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CodeMart.Server.Models
{
    [Table("reviews", Schema = "public")]
    public class Review
    {
        [Key]
        public int Id { get; set; }

        public int ProjectId { get; set; }
        [ForeignKey("ProjectId")]
        public Project Project { get; set; }

        public int ReviewerId { get; set; }
        [ForeignKey("ReviewerId")]
        public User Reviewer { get; set; }

        [Required]
        public string Comment { get; set; }

        [Required]
        public DateTime DateAdded { get; set; }

        [Required]
        [Range(0, 5)]
        public int Rating { get; set; }
    }
}
