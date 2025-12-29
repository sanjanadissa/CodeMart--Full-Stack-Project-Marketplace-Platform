using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.DTOs.User;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Utils;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeMart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticateService _authenticateService;
        private readonly IUserService _userService;

        public AuthController(IAuthenticateService authenticateService, IUserService userService)
        {
            _authenticateService = authenticateService;
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var token = await _authenticateService.Login(request.Email, request.Password);

            if (token == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(new { token = token });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var user = await _authenticateService.GetCurrentUser(currentUserId.Value);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] UserDtoIn dtoIn)
        {
            if (dtoIn == null)
            {
                return BadRequest("Bad Request.");
            }

            var token = await _authenticateService.Signup(dtoIn);
            if (token == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }
            return Ok(new { token = token });
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleTokenDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Token))
                return BadRequest("Token is required.");

            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(dto.Token,
                new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] {
                        "732606690978-h5c4rmj2tojdg2s51hfa82ve93l7v2tg.apps.googleusercontent.com"

                    }
                });

                string email = payload.Email;
                string name = payload.Name;
                string picture = payload.Picture;

                var existingUser = await _userService.GetUserByEmailAsync(email);

                // If user does not exist, register using Google details
                if (existingUser == null)
                {
                    var newUser = new UserDtoIn
                    {
                        Email = email,
                        FirstName = name.Split(' ')[0],
                        LastName = name.Contains(' ') ? name.Split(' ')[1] : "",
                        ProfilePicture = picture,
                        Password = Guid.NewGuid().ToString(), // needed for DB
                        Occupation = "Not Provided",
                        CompanyName = ""
                    };


                    // signup returns JWT token
                    var token = await _authenticateService.Signup(newUser);
                    return Ok(new { token });
                }

                // User exists → Login and return JWT
                var finalToken = await _authenticateService.Login(email, null);

                return Ok(new { token = finalToken });
            }
            catch (Exception ex)
            {
                return Unauthorized(new
                {
                    message = "Google token validation failed",
                    error = ex.Message,
                    stack = ex.ToString()
                });
            }

        }

    }
}
