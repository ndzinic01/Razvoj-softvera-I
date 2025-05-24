using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Linq;
using System.Threading.Tasks;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteOrderEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteOrderEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        // DELETE: api/Narudzbe/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound($"Order with {id} not found.");
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
