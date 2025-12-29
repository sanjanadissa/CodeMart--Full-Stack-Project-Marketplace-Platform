using CodeMart.Server.Models;

namespace CodeMart.Server.DTOs.Project
{
    public class ProjectUpdateDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public Category Category { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ProjectUrl { get; set; }
        public string? VideoUrl { get; set; }
        public List<string> ImageUrls { get; set; } = new List<string>();
        public List<string>? PrimaryLanguages { get; set; }
        public List<string>? SecondaryLanguages { get; set; } = new List<string>();
        public List<string> Features { get; set; } = new List<string>();
    }
}
