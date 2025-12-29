using CodeMart.Server.Models;
using System.ComponentModel.DataAnnotations;
using CodeMart.Server.DTOs.User;

namespace CodeMart.Server.DTOs.Project
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; }
        public Category Category { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ProjectUrl { get; set; }
        public List<ReviewDto>? Review { get; set; } = new List<ReviewDto>();
        public string? VideoUrl { get; set; }
        public DateTime UploadDate { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string>? PrimaryLanguages { get; set; }
        public List<string>? SecondaryLanguages { get; set; } = new List<string>();
        public List<string>? Features { get; set; } = new List<string>();
        public Permissions Permission { get; set; }
        public UserDtoOut? Owner { get; set; }
        public List<int>? Buyers { get; set; } = new List<int>();
        public DateTime CreatedAt { get; set; }
        public double Rating { get; set; }
    }
}
