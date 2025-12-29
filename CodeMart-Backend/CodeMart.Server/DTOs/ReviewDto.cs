using CodeMart.Server.DTOs.User;

namespace CodeMart.Server.DTOs
{
    public class ReviewDto
    {
        public string Comment { get; set; }
        public DateTime DateAdded { get; set; }
        public int Rating { get; set; }
        public UserDtoOut? Reviewer { get; set; }
    }
}
