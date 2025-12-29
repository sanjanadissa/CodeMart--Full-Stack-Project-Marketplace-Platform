namespace CodeMart.Server.DTOs.User
{
    public class UserDtoIn
    {
        public string FirstName { get; set; }
        public string? LastName { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string Occupation { get; set; }
        public string? CompanyName { get; set; }
        public string? ProfilePicture { get; set; }
    }
}
