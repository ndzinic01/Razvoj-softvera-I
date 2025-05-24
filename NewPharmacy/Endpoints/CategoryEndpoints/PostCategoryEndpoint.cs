using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostCategoryEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostCategoryEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult PostCategory([FromBody] Category category)
        {
            if (string.IsNullOrWhiteSpace(category.Name))
                return BadRequest("Category name cannot be empty.");

            _context.Categories.Add(category);
            _context.SaveChanges();

            return CreatedAtRoute("GetCategoryById", new { id = category.Id }, category);
        }
    }
}