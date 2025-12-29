using CodeMart.Server.DTOs;
using CodeMart.Server.DTOs.User;
using CodeMart.Server.Interfaces;
using CodeMart.Server.Models;
using CodeMart.Server.Services;
using CodeMart.Server.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodeMart.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;
        private readonly IProjectService _projectService;

        public OrderController(IOrderService orderService, IUserService userService, IProjectService projectService)
        {
            _orderService = orderService;
            _userService = userService;
            _projectService = projectService;

        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            var dto = new OrderDto
            {
                Amount = order.Amount,
                OrderDate = order.OrderDate,
                IsCompleted = order.IsCompleted
            };
            return Ok(dto);
        }


        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllOrdersByUserId([FromQuery] int userId)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (currentUserId != userId && !isAdmin)
            {
                return Forbid("You can only view your own orders.");
            }

            var orders = await _orderService.GetAllOrdersByUserIdOrderByDateAsync(userId);
            if (orders == null || orders.Count == 0)
            {
                return Ok(new List<OrderDto>());
            }
            var dtos = orders.Select(o => new OrderDto
            {
                Amount = o.Amount,
                OrderDate = o.OrderDate,
                IsCompleted = o.IsCompleted
            }).ToList();
            return Ok(dtos);
        }


        [HttpPost("add")]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromQuery] int projectId, [FromBody] OrderDto dto)
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
            if (!isAdmin)
            {
                return Forbid("Not Authorized.");
            }

            var buyer = await _userService.GetUserByIdAsync((int)currentUserId);
            if (buyer == null)
                return NotFound($"Buyer with ID {currentUserId} not found.");

            var project = await _projectService.GetProjectByIdAsync(projectId);
            if (project == null)
                return NotFound($"Project with ID {projectId} not found.");

            var order = new Order
            {
                Amount = dto.Amount,
                OrderDate = DateTime.UtcNow,
                IsCompleted = dto.IsCompleted,
                Buyer = buyer,
                Project = project
            };

            var createdOrder = await _orderService.CreateOrderAsync(order);
            if (createdOrder == null)
            {
                return StatusCode(500, "Internal Server Error.");
            }

            var dtoOut = new OrderDto
            {
                Amount = createdOrder.Amount,
                OrderDate = createdOrder.OrderDate,
                IsCompleted = createdOrder.IsCompleted
            };
            return CreatedAtAction(
                nameof(GetOrderById),
                new { id = createdOrder.Id },
                dtoOut
            );
        }


        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Not Authorized.");
            }

            var result = await _orderService.DeleteOrderAsync(id);
            if (!result)
            {
                return StatusCode(500, "Internal Server Error.");
            }
            return Ok($"Deleted Order {id}");
        }


        [HttpPut("complete/{id}")]
        [Authorize]
        public async Task<IActionResult> CompleteOrder(int id)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Not Authorized.");
            }

            var result = await _orderService.CompleteOrderAsync(id);
            if (!result)
            {
                return StatusCode(500, "Internal Server Error.");
            }
            return Ok($"Deleted User {id}");
        }


        [HttpGet("projectcount")]
        [Authorize]
        public async Task<IActionResult> GetOrderCount([FromQuery] int projectId)
        {
            var currentUserId = ControllerHelpers.GetCurrentUserId(User);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token.");
            }

            var isAdmin = ControllerHelpers.IsCurrentUserAdmin(User);
            if (!isAdmin)
            {
                return Forbid("Not Authorized.");
            }

            var count = await _orderService.GetOrderCountForProjectAsync(projectId);
            return Ok(count);
        }
    }
}
