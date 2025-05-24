using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using System.Linq;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteProductEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteProductEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            _context.Products.Remove(product);
            _context.SaveChanges();

            return NoContent();
        }
    }
}