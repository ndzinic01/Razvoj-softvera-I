using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using System.Linq;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PutProductEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PutProductEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPut("{id}")]
        public IActionResult PutProduct(int id, [FromBody] Product product)
        {
            if (product == null || product.Id != id)
            {
                return BadRequest("The product information is not valid.");
            }

            var existingProduct = _context.Products.FirstOrDefault(p => p.Id == id);
            if (existingProduct == null)
            {
                return NotFound("Product not found.");
            }

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.QuantityInStock = product.QuantityInStock;

            _context.SaveChanges();

            return NoContent();
        }
    }
}
