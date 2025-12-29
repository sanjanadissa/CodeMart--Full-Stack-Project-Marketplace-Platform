using CodeMart.Server.DTOs.User;

namespace CodeMart.Server.Interfaces
{
    public interface IAuthenticateService
    {
        Task<string?> Login(string email, string? password);
        Task<UserDtoOut?> GetCurrentUser(int id);
        Task<string?> Signup(UserDtoIn dto);
    }
}
