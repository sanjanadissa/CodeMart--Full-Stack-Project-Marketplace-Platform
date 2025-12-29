using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.DTOs;
using CodeMart.Server.DTOs.User;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Utils;

namespace CodeMart.Server.Services
{
    public class AuthenticateService : IAuthenticateService
    {
        private readonly IUserService _userService;
        private readonly IJwtTokenService _jwtTokenService;
        public AuthenticateService(IUserService userService, IJwtTokenService JwtTokenService)
        {
            _userService = userService;
            _jwtTokenService = JwtTokenService;
        }

        public async Task<string?> Login(string email, string? password)
        {
            // Google login -> no password
            if (password == null)
            {
                var existingUser = await _userService.GetUserByEmailAsync(email);
                if (existingUser == null)
                    return null;

                string googleToken = _jwtTokenService.GenerateToken(existingUser);
                return googleToken;
            }

            // Normal login
            var user = await _userService.ValidateUserCredentialsAsync(email, password);
            if (user == null)
            {
                return null;
            }

            string token = _jwtTokenService.GenerateToken(user);
            return token;
        }



        public async Task<UserDtoOut?> GetCurrentUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return null;
            }
            var orders = user.Orders.Select(o => new OrderDto
            {
                Amount = o.Amount,
                OrderDate = o.OrderDate,
                IsCompleted = o.IsCompleted
            }).ToList();

            var dto = new UserDtoOut
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Occupation = user.Occupation,
                CompanyName = user.CompanyName,
                ProfilePicture = user.ProfilePicture,
                IsAdmin = user.IsAdmin,
                Orders = orders
            };
            return dto;
        }


        public async Task<string?> Signup(UserDtoIn dtoIn)
        {
            if (dtoIn == null)
                return null;

            var user = new User
            {
                FirstName = dtoIn.FirstName,
                LastName = dtoIn.LastName,
                Email = dtoIn.Email,
                Password = dtoIn.Password, // will be null for Google user
                Occupation = dtoIn.Occupation,
                CompanyName = dtoIn.CompanyName,
                ProfilePicture = dtoIn.ProfilePicture,
                IsAdmin = false
            };

            // If signup from Google, no password

            var createdUser = await _userService.CreateUserAsync(user);
            if (createdUser == null)
                return null;

            string token = _jwtTokenService.GenerateToken(createdUser);
            return token;
        }

    }
}
