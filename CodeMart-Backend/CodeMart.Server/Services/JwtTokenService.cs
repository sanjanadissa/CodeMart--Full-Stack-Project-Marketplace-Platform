using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

namespace CodeMart.Server.Services
{
    public class JwtTokenService : IJwtTokenService
    {
        private readonly JwtOptions _options;

        public JwtTokenService(IOptions<JwtOptions> options)
        {
            _options = options.Value ?? throw new ArgumentNullException(nameof(options));
            if (string.IsNullOrWhiteSpace(_options.Key))
            {
                throw new InvalidOperationException("JWT signing key is not configured.");
            }
        }

        public string GenerateToken(User user)
        {
            ArgumentNullException.ThrowIfNull(user);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Email, user.Email),
                new(JwtRegisteredClaimNames.GivenName, user.FirstName),
                new("isAdmin", user.IsAdmin.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(_options.AccessTokenExpirationMinutes);

            var token = new JwtSecurityToken(
                issuer: _options.Issuer,
                audience: _options.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

