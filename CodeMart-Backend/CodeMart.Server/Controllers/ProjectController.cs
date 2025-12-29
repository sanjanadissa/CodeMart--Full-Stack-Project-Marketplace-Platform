using CodeMart.CodeMart.Server.Models;
using CodeMart.Server.DTOs;
using CodeMart.Server.DTOs.Project;
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
    public class ProjectController : Controller
    {
        private readonly IProjectService _projectService;
        private readonly IUserService _userService;
        public ProjectController(IProjectService projectService, IUserService userService)
        {
            _projectService = projectService;
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProjectId(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null)
            {
                return NotFound();
            }

            var dto = new ProjectDto
            {
                Id = project.Id,
                OwnerId = project.OwnerId,
                Name = project.Name,
                Category = project.Category,
                Description = project.Description,
                Price = project.Price,
                ProjectUrl = project.ProjectUrl,
                VideoUrl = project.VideoUrl,
                UploadDate = project.UploadDate,
                ImageUrls = project.ImageUrls,
                PrimaryLanguages = project.PrimaryLanguages,
                SecondaryLanguages = project.SecondaryLanguages,
                Permission = project.Permission,
                Review = project.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
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
                }).ToList(),
                Features = project.Features
            };
            return Ok(dto);
        }

        [HttpGet("projects")]
        public async Task<IActionResult> GetAllProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            var dtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                Name = p.Name,
                Category = p.Category,
                Description = p.Description,
                Price = p.Price,
                ProjectUrl = p.ProjectUrl,
                VideoUrl = p.VideoUrl,
                UploadDate = p.UploadDate,
                ImageUrls = p.ImageUrls,
                Review = p.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
                }).ToList(),
                PrimaryLanguages = p.PrimaryLanguages,
                SecondaryLanguages = p.SecondaryLanguages,
                Permission = p.Permission,
                Features = p.Features,
                Owner = new UserDtoOut
                {
                    Id = p.Owner.Id,
                    FirstName = p.Owner.FirstName,
                    LastName = p.Owner.LastName,
                    FullName = p.Owner.FullName,
                    Email = p.Owner.Email,
                    Occupation = p.Owner.Occupation,
                    CompanyName = p.Owner.CompanyName,
                    ProfilePicture = p.Owner.ProfilePicture,
                    IsAdmin = p.Owner.IsAdmin,
                },
                Buyers = p.Buyers.Select(b => b.Id).ToList(),
                CreatedAt = p.UploadDate,
                Rating = p.Review.Count > 0 
                    ? Math.Round(p.Review.Average(r => r.Rating), 1)
                    : 0
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("filter/rating")]
        public async Task<IActionResult> GetProjectsMoreThanRating([FromQuery] int rating)
        {
            var projects = await _projectService.GetProjectsMoreThanRatingAsync(rating);
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            
            var dtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                Name = p.Name,
                Category = p.Category,
                Description = p.Description,
                Price = p.Price,
                ProjectUrl = p.ProjectUrl,
                VideoUrl = p.VideoUrl,
                UploadDate = p.UploadDate,
                ImageUrls = p.ImageUrls,
                Review = p.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
                }).ToList(),
                PrimaryLanguages = p.PrimaryLanguages,
                SecondaryLanguages = p.SecondaryLanguages,
                Permission = p.Permission,
                Features = p.Features,
                Owner = new UserDtoOut
                {
                    Id = p.Owner.Id,
                    FirstName = p.Owner.FirstName,
                    LastName = p.Owner.LastName,
                    FullName = p.Owner.FullName,
                    Email = p.Owner.Email,
                    Occupation = p.Owner.Occupation,
                    CompanyName = p.Owner.CompanyName,
                    ProfilePicture = p.Owner.ProfilePicture,
                    IsAdmin = p.Owner.IsAdmin,
                },
                Buyers = p.Buyers.Select(b => b.Id).ToList(),
                CreatedAt = p.UploadDate,
                Rating = p.Review.Count > 0 
                    ? Math.Round(p.Review.Average(r => r.Rating), 1)
                    : 0
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("filter/category")]
        public async Task<IActionResult> GetProjectsByCategory([FromQuery] Category category)
        {
            var projects = await _projectService.GetProjectsForGivenCategoryAsync(category);
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            var dtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                Name = p.Name,
                Category = p.Category,
                Description = p.Description,
                Price = p.Price,
                ProjectUrl = p.ProjectUrl,
                VideoUrl = p.VideoUrl,
                UploadDate = p.UploadDate,
                ImageUrls = p.ImageUrls,
                Review = p.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
                }).ToList(),
                PrimaryLanguages = p.PrimaryLanguages,
                SecondaryLanguages = p.SecondaryLanguages,
                Permission = p.Permission,
                Features = p.Features,
                Owner = new UserDtoOut
                {
                    Id = p.Owner.Id,
                    FirstName = p.Owner.FirstName,
                    LastName = p.Owner.LastName,
                    FullName = p.Owner.FullName,
                    Email = p.Owner.Email,
                    Occupation = p.Owner.Occupation,
                    CompanyName = p.Owner.CompanyName,
                    ProfilePicture = p.Owner.ProfilePicture,
                    IsAdmin = p.Owner.IsAdmin,
                },
                Buyers = p.Buyers.Select(b => b.Id).ToList(),
                CreatedAt = p.UploadDate,
                Rating = p.Review.Count > 0 
                    ? Math.Round(p.Review.Average(r => r.Rating), 1)
                    : 0
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("filter/price")]
        public async Task<IActionResult> GetProjectsByPrice([FromQuery] decimal lowPrice, [FromQuery] decimal highPrice)
        {
            var projects = await _projectService.GetProjectsBetweenPriceAsync(lowPrice, highPrice);
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());

            }
            
            var dtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                Name = p.Name,
                Category = p.Category,
                Description = p.Description,
                Price = p.Price,
                ProjectUrl = p.ProjectUrl,
                VideoUrl = p.VideoUrl,
                UploadDate = p.UploadDate,
                ImageUrls = p.ImageUrls,
                Review = p.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
                }).ToList(),
                PrimaryLanguages = p.PrimaryLanguages,
                SecondaryLanguages = p.SecondaryLanguages,
                Permission = p.Permission,
                Features = p.Features,
                Owner = new UserDtoOut
                {
                    Id = p.Owner.Id,
                    FirstName = p.Owner.FirstName,
                    LastName = p.Owner.LastName,
                    FullName = p.Owner.FullName,
                    Email = p.Owner.Email,
                    Occupation = p.Owner.Occupation,
                    CompanyName = p.Owner.CompanyName,
                    ProfilePicture = p.Owner.ProfilePicture,
                    IsAdmin = p.Owner.IsAdmin,
                },
                Buyers = p.Buyers.Select(b => b.Id).ToList(),
                CreatedAt = p.UploadDate,
                Rating = p.Review.Count > 0 
                    ? Math.Round(p.Review.Average(r => r.Rating), 1)
                    : 0
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("featured")]
        public async Task<IActionResult> GetFeaturedProjects()
        {
            var featuredProjects = await _projectService.GetFeaturedProjectsAsync(7);
            if (featuredProjects == null || featuredProjects.Count == 0)
            {
                return Ok(new List<Project>());
            }
            var dtos = featuredProjects.Select(p => new ProjectDto
            {
                Id = p.Id,
                OwnerId = p.OwnerId,
                Name = p.Name,
                Category = p.Category,
                Description = p.Description,
                Price = p.Price,
                ProjectUrl = p.ProjectUrl,
                VideoUrl = p.VideoUrl,
                UploadDate = p.UploadDate,
                ImageUrls = p.ImageUrls,
                Review = p.Review.Select(r => new ReviewDto
                {
                    Rating = r.Rating,
                    DateAdded = r.DateAdded,
                    Comment = r.Comment,
                }).ToList(),
                PrimaryLanguages = p.PrimaryLanguages,
                SecondaryLanguages = p.SecondaryLanguages,
                Permission = p.Permission,
                Features = p.Features,
                Owner = new UserDtoOut
                {
                    Id = p.Owner.Id,
                    FirstName = p.Owner.FirstName,
                    LastName = p.Owner.LastName,
                    FullName = p.Owner.FullName,
                    Email = p.Owner.Email,
                    Occupation = p.Owner.Occupation,
                    CompanyName = p.Owner.CompanyName,
                    ProfilePicture = p.Owner.ProfilePicture,
                    IsAdmin = p.Owner.IsAdmin,
                },
                Buyers = p.Buyers.Select(b => b.Id).ToList(),
                CreatedAt = p.UploadDate,
                Rating = p.Review.Count > 0
                    ? Math.Round(p.Review.Average(r => r.Rating), 1)
                    : 0
            }).ToList();
            return Ok(dtos);
        }

       [HttpGet("ownerrating/{id}")]
        public async Task<IActionResult> GetOwnerRating(int id)
        {
            var rating = await _projectService.GetOwnerRating(id);

            return Ok(rating);
        }
        
        [HttpGet("buyers")]
        [Authorize]
        public async Task<IActionResult> GetBuyers([FromQuery] int projectId)
        {
            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("You're not authorized");
            }

            var buyers = await _projectService.GetBuyersAsync(projectId);
            if (buyers == null || buyers.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            var dtos = buyers.Select(b => new UserDtoOut
            {
                Id = b.Id,
                FirstName = b.FirstName,
                LastName = b.LastName,
                Email = b.Email,
                Occupation = b.Occupation,
                CompanyName = b.CompanyName,
                ProfilePicture = b.ProfilePicture,
                IsAdmin = b.IsAdmin,
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("reviews")]
        public async Task<IActionResult> GetReviewes([FromQuery] int projectId)
        {
            var reviews = await _projectService.GetReviewesAsync(projectId);
            if (reviews == null || reviews.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            var dtos = reviews.Select(r => new ReviewDto
            {
                Comment = r.Comment,
                DateAdded = r.DateAdded,
                Rating = r.Rating,
            }).ToList();
            return Ok(dtos);
        }

        [HttpGet("filter/permission")]
        public async Task<IActionResult> GetProjectsByPermission([FromQuery] Permissions permission)
        {
            var projects = await _projectService.GetProjectByPermissionAsync(permission);
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            
            return Ok(projects);
        }

        [HttpPost("createproject")]
        [Authorize]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDto dto)
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

            var owner = await _userService.GetUserByIdAsync((int)currentUserId);
            if (owner == null)
                return NotFound($"Buyer with ID {currentUserId} not found.");

            var project = new Project
            {
                Name = dto.Name,
                Category = dto.Category,
                Description = dto.Description,
                Price = dto.Price,
                ProjectUrl = dto.ProjectUrl,
                VideoUrl = dto.VideoUrl,
                UploadDate = DateTime.UtcNow,
                ImageUrls = dto.ImageUrls,
                PrimaryLanguages = dto.PrimaryLanguages,
                SecondaryLanguages = dto.SecondaryLanguages,
                Owner = owner,
                Features = dto.Features,
            };

            var createdProject = await _projectService.CreateProjectAsync(project);
            if (createdProject == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new ProjectDto
            {
                Id = createdProject.Id,
                OwnerId = createdProject.OwnerId,
                Name = createdProject.Name,
                Category = createdProject.Category,
                Description = createdProject.Description,
                Price = createdProject.Price,
                ProjectUrl = createdProject.ProjectUrl,
                VideoUrl = createdProject.VideoUrl,
                UploadDate = createdProject.UploadDate,
                ImageUrls = createdProject.ImageUrls,
                PrimaryLanguages = createdProject.PrimaryLanguages,
                SecondaryLanguages = createdProject.SecondaryLanguages,
                Permission = createdProject.Permission,
                Features = createdProject.Features,
            };
            return CreatedAtAction(
                nameof(GetProjectId),
                new { id = createdProject.Id },
                dtoOut
            );
        }


        [HttpGet("revenue/{id}")]
        [Authorize]
        public async Task<IActionResult> GetProjectRevenue(int id)
        {
            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);

            var project = await _projectService.GetProjectByIdAsync(id);

            if (!isAdmin && project?.OwnerId != currentUserId)
            {
                return Forbid("You're not authorized");
            }
            var revenue = await _projectService.GetTotalRevenueForProjectAsync(id);
            return Ok(revenue);
        }

        [HttpGet("revenue/{id}/{month}")]
        [Authorize]
        public async Task<IActionResult> GetProjectRevenueByMonth(int id, int month)
        {
            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);

            var project = await _projectService.GetProjectByIdAsync(id);

            if (!isAdmin && project?.OwnerId != currentUserId)
            {
                return Forbid("You're not authorized");
            }
            var revenue = await _projectService.GetTotalRevenueForProjectByMonthAsync(id, month);
            return Ok(revenue);
        }

        [HttpGet("owned")]
        [Authorize]
        public async Task<IActionResult> IsProjectOwnedByUser([FromQuery] int projId)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            var isProjectOwnedByUser = await _projectService.IsProjectOwnedByUserAsync((int)currentUserId, projId);

            if (!isProjectOwnedByUser)
            {
                return Ok(false);
            }
            return Ok(true);
        }


        [HttpGet("purchased/{id}")]
        [Authorize]
        public async Task<IActionResult> HasUserPurchasedProject(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var hasPurchased = await _projectService.HasUserPurchasedProjectAsync((int)currentUserId, id);
            return Ok(hasPurchased);
        }


        [HttpGet("sortedbyprice")]
        public async Task<IActionResult> GetProjectSortedByPrice()
        {
            var projects = await _projectService.GetProjectsSortedByPriceAsync();
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<ProjectDto>());
            }
            
            return Ok(projects);
        }


        [HttpGet("searchprojects")]
        public async Task<IActionResult> SearchProject([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest("Name parameter is required.");
            }

            var projects = await _projectService.SearchProjectAsync(name);
            if (projects == null || projects.Count == 0)
            {
                return Ok(new List<Project>());
            }
            
            return Ok(projects);
        }


        [HttpGet("approve/{id}")]
        [Authorize]
        public async Task<IActionResult> ApproveProject(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }
            if (!ControllerHelpers.IsCurrentUserAdmin(User))
            {
                return Forbid("You're not authorized");
            }

            var approved = await _projectService.ApproveProjectAsync(id);
            return Ok(approved);
        }


        [HttpGet("reject/{id}")]
        [Authorize]
        public async Task<IActionResult> RejectProject(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }
            if (!ControllerHelpers.IsCurrentUserAdmin(User))
            {
                return Forbid("You're not authorized");
            }

            var rejected = await _projectService.RejectProjectAsync(id);
            return Ok(rejected);
        }


        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectUpdateDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Bad Request.");
            }

            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            var owner = await _userService.GetUserByIdAsync((int)currentUserId);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var project = await _projectService.GetProjectByIdAsync(id);

            if (!ControllerHelpers.IsCurrentUserAdmin(User) && project?.OwnerId != currentUserId)
            {
                return Unauthorized("Unauthorized access");
            }

            var updatedProject = await _projectService.UpdateProjectAsync(new Project
            {
                Id = id,
                Name = dto.Name,
                Category = dto.Category,
                Description = dto.Description,
                Price = dto.Price,
                ProjectUrl = dto.ProjectUrl,
                VideoUrl = dto.VideoUrl,
                ImageUrls = dto.ImageUrls,
                PrimaryLanguages = dto.PrimaryLanguages,
                SecondaryLanguages = dto.SecondaryLanguages,
                Owner = owner,
                Features = dto.Features,
            });

            if (updatedProject == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new ProjectDto
            {
                Id = updatedProject.Id,
                OwnerId = updatedProject.OwnerId,
                Name = updatedProject.Name,
                Category = updatedProject.Category,
                Description = updatedProject.Description,
                Price = updatedProject.Price,
                ProjectUrl = updatedProject.ProjectUrl,
                VideoUrl = updatedProject.VideoUrl,
                UploadDate = updatedProject.UploadDate,
                ImageUrls = updatedProject.ImageUrls,
                PrimaryLanguages = updatedProject.PrimaryLanguages,
                SecondaryLanguages = updatedProject.SecondaryLanguages,
                Permission = updatedProject.Permission,
                Features = updatedProject.Features,
            };
            return Ok(dtoOut);
        }


        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }
            var project = await _projectService.GetProjectByIdAsync(id);

            if(!ControllerHelpers.IsCurrentUserAdmin(User) && project?.OwnerId != currentUserId)
            {
                return Unauthorized("Unauthorized access");
            }

            var result = await _projectService.DeleteProjectAsync(id);
            return Ok(result);
        }
    }
}