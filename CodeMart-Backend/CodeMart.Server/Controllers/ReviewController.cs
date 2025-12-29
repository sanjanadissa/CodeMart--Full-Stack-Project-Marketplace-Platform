using CodeMart.Server.DTOs;
using CodeMart.Server.DTOs.User;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using CodeMart.Server.Services;
using CodeMart.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CodeMart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : Controller
    {
        private readonly IReviewService _reviewService;
        private readonly IUserService _userService;
        private readonly IProjectService _projectService;
        public ReviewController(IReviewService reviewService, IUserService userService, IProjectService projectService)
        {
            _reviewService = reviewService;
            _userService = userService;
            _projectService = projectService;
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(int id)
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
            {
                return NotFound();
            }
            var dto = new ReviewDto
            {
                Comment = review.Comment,
                DateAdded = review.DateAdded,
                Rating = review.Rating,
                Reviewer = new UserDtoOut
                {
                    Id = review.Reviewer.Id,
                    FirstName = review.Reviewer.FirstName,
                    LastName = review.Reviewer.LastName,
                    FullName = review.Reviewer.FullName,
                    Email = review.Reviewer.Email,
                    Occupation = review.Reviewer.Occupation,
                    CompanyName = review.Reviewer.CompanyName,
                    ProfilePicture = review.Reviewer.ProfilePicture,
                    IsAdmin = review.Reviewer.IsAdmin,
                }
            };
            return Ok(dto);
        }


        [HttpGet("reviews")]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _reviewService.GetAllReviewsAsync();
            if (reviews == null || reviews.Count == 0)
            {
                return Ok(new List<ReviewDto>());
            }
            var dtos = reviews.Select(r => new ReviewDto
            {
                Comment = r.Comment,
                DateAdded = r.DateAdded,
                Rating = r.Rating,
                Reviewer = new UserDtoOut
                {
                    Id = r.Reviewer.Id,
                    FirstName = r.Reviewer.FirstName,
                    LastName = r.Reviewer.LastName,
                    FullName = r.Reviewer.FullName,
                    Email = r.Reviewer.Email,
                    Occupation = r.Reviewer.Occupation,
                    CompanyName = r.Reviewer.CompanyName,
                    ProfilePicture = r.Reviewer.ProfilePicture,
                    IsAdmin = r.Reviewer.IsAdmin,
                }
            }).ToList();
            return Ok(dtos);
        }


        [HttpGet]
        public async Task<IActionResult> GetReviewsByProjectId([FromQuery] int projectId)
        {
            var reviews = await _reviewService.GetReviewsByProjectIdAsync(projectId);
            if (reviews == null || reviews.Count == 0)
            {
                return Ok(new List<ReviewDto>());
            }
            var dtos = reviews.Select(r => new ReviewDto
            {
                Comment = r.Comment,
                DateAdded = r.DateAdded,
                Rating = r.Rating,
                Reviewer = new UserDtoOut
                {
                    Id = r.Reviewer.Id,
                    FirstName = r.Reviewer.FirstName,
                    LastName = r.Reviewer.LastName,
                    FullName = r.Reviewer.FullName,
                    Email = r.Reviewer.Email,
                    Occupation = r.Reviewer.Occupation,
                    CompanyName = r.Reviewer.CompanyName,
                    ProfilePicture = r.Reviewer.ProfilePicture,
                    IsAdmin = r.Reviewer.IsAdmin,
                }
            }).ToList();
            return Ok(dtos);
        }


        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromQuery] int projectId, [FromBody] ReviewDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Bad Request.");
            }

            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var reviewer = await _userService.GetUserByIdAsync((int)currentUserId);
            if (reviewer == null)
                return NotFound($"Buyer with ID {currentUserId} not found.");

            var project = await _projectService.GetProjectByIdAsync(projectId);
            if (project == null)
                return NotFound($"Project with ID {projectId} not found.");

            var review = new Review
            {
                Comment = dto.Comment,
                DateAdded = dto.DateAdded,
                Rating = dto.Rating,
                Reviewer = reviewer,
                Project = project
            };
            var createdReview = await _reviewService.CreateReviewAsync(review);
            if (createdReview == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new ReviewDto
            {
                Comment = createdReview.Comment,
                DateAdded = createdReview.DateAdded,
                Rating = createdReview.Rating,
                Reviewer = new UserDtoOut
                {
                    Id = createdReview.Reviewer.Id,
                    FirstName = createdReview.Reviewer.FirstName,
                    LastName = createdReview.Reviewer.LastName,
                    FullName = createdReview.Reviewer.FullName,
                    Email = createdReview.Reviewer.Email,
                    Occupation = createdReview.Reviewer.Occupation,
                    CompanyName = createdReview.Reviewer.CompanyName,
                    ProfilePicture = createdReview.Reviewer.ProfilePicture,
                    IsAdmin = createdReview.Reviewer.IsAdmin,
                }
            };
            return CreatedAtAction(
                nameof(GetReviewById),
                new { id = createdReview.Id },
                dtoOut
            );
        }


        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Bad Request.");
            }

            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (currentUserId != id && !isAdmin)
            {
                return Forbid("You can only update your own profile.");
            }

            var updatedReview = await _reviewService.UpdateReviewAsync(new Review
            {
                Comment = dto.Comment,
                DateAdded = DateTime.UtcNow,
                Rating = dto.Rating
            });

            if (updatedReview == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new ReviewDto
            {
                Comment = updatedReview.Comment,
                DateAdded = updatedReview.DateAdded,
                Rating = updatedReview.Rating,
                Reviewer = new UserDtoOut
                {
                    Id = updatedReview.Reviewer.Id,
                    FirstName = updatedReview.Reviewer.FirstName,
                    LastName = updatedReview.Reviewer.LastName,
                    FullName = updatedReview.Reviewer.FullName,
                    Email = updatedReview.Reviewer.Email,
                    Occupation = updatedReview.Reviewer.Occupation,
                    CompanyName = updatedReview.Reviewer.CompanyName,
                    ProfilePicture = updatedReview.Reviewer.ProfilePicture,
                    IsAdmin = updatedReview.Reviewer.IsAdmin,
                }
            };
            return Ok(dtoOut);
        }


        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id, [FromQuery] int userId)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (currentUserId != userId && !isAdmin)
            {
                return Forbid("Not Authorized.");
            }

            var result = await _reviewService.DeleteReviewAsync(id);
            if (!result)
            {
                return StatusCode(500, "Internal Server Error.");
            }
            return Ok($"Deleted Review {id}");
        }
    }
}
