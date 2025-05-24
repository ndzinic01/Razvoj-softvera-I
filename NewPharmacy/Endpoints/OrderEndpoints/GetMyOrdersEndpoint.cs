using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints.OrderEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetMyOrdersEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetMyOrdersEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMyOrders(int userId)
        {
            var orders = await _context.Orders
                .Where(o => o.MyAppUserId == userId && o.IsSupplyOrder == true)
    .       ToListAsync();

            var orderIds = orders.Select(o => o.Id).ToList();

            var orderDetails = await _context.OrderDetails
                .Where(od => orderIds.Contains(od.OrderId))
                .Include(od => od.Product)
            .ToListAsync();

            var result = orders.Select(order => new
            {
                order.Id,
                order.OrderDate,
                order.Status,
                OrderDetails = orderDetails
                    .Where(od => od.OrderId == order.Id)
                    .Select(od => new
                    {
                        od.Product?.Name,
                        od.Qty,
                        od.PricePerUnit
                    }).ToList()
            }).ToList();

            return Ok(result);
        }
    }
}
