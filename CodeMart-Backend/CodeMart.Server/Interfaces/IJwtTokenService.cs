using System.Security.Claims;
using CodeMart.CodeMart.Server.Models;

namespace CodeMart.Server.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}

