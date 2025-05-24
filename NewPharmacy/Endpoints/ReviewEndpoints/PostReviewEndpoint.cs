using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints.ReviewEndpoints
{
    [ApiController]
    [Route("api")]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-review")]
        public IActionResult AddReview([FromBody] ReviewDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var review = new Review
            {
                UserName = dto.UserName,
                Rating = dto.Rating,
                Text = dto.Text,
                ProductId = dto.ProductId
            };

            _context.Reviews.Add(review);
            _context.SaveChanges();

            return Ok(new { message = "Review added successfully" });
        }
    }

}
