using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class GetOrderByIdEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GetOrderByIdEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Narudzbe/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(n => n.MyAppUser)
                //.Include(n => n.Supplier)
                .FirstOrDefaultAsync(n => n.Id == id);

            if (order == null)
            {
                return NotFound("Order with Id {id} not found.");
            }

            return Ok(order);
        }
    }
}