using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace CodeMart.Server.Utils
{
    public static class ControllerHelpers
    {
        public static int? GetCurrentUserId(ClaimsPrincipal? user)
        {
            if (user == null) return null;

            var userIdClaim = user.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                ?? user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (int.TryParse(userIdClaim, out int userId))
            {
                return userId;
            }
            return null;
        }

        public static bool IsCurrentUserAdmin(ClaimsPrincipal? user)
        {
            if (user == null) return false;

            var isAdminClaim = user.FindFirst("isAdmin")?.Value;
            return isAdminClaim == "True";
        }

        public static string? GetCurrentUserEmail(ClaimsPrincipal? user)
        {
            if (user == null) return null;

            return user.FindFirst(JwtRegisteredClaimNames.Email)?.Value
                ?? user.FindFirst(ClaimTypes.Email)?.Value;
        }
    }
}
