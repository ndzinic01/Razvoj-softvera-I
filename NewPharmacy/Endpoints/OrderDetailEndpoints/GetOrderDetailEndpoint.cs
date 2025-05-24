using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data.Models;
using NewPharmacy.Data;
using Microsoft.EntityFrameworkCore;

namespace NewPharmacy.Endpoints.OrderDetailEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetOrderDetailsEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetOrderDetailsEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("by-order/{orderId}")]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetDetailsByOrderId(int orderId)
        {
            var details = await _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == orderId)
                .ToListAsync();

            if (!details.Any())
                return NotFound("Nema stavki za ovu narudžbu.");

            return Ok(details);
        }
    }

}
