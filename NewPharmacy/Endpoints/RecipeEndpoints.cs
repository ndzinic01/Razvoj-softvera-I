using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;

namespace NewPharmacy.Endpoints
{
    [ApiController]
    [Route("api/recipes")] // ← OSNOVNA RUTA
    public class RecipeEndpoints : Controller
    {
        private readonly ApplicationDbContext _context;

        public RecipeEndpoints(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/recipes
        [HttpPost]
        public async Task<ActionResult<List<Recipe>>> AddAndGetRecipes([FromForm] RecipeUploadDto dto)
        {
            var newRecipe = new Recipe
            {
                DateOfIssue = DateTime.Now,
                DoctorFirstname = dto.DoctorFirstname,
                DoctorLastname = dto.DoctorLastname,
                MyAppUserId = dto.MyAppUserId,
                Status = "Na čekanju"
            };

            if (dto.Scan != null)
            {
                using var ms = new MemoryStream();
                await dto.Scan.CopyToAsync(ms);
                newRecipe.Scan = ms.ToArray();
            }

            _context.Recipes.Add(newRecipe);
            await _context.SaveChangesAsync();

            var userRecipes = await _context.Recipes
                .Where(r => r.MyAppUserId == dto.MyAppUserId)
                .ToListAsync();

            return Ok(userRecipes);
        }

        // GET: api/recipes/user/5
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<Recipe>>> GetRecipesByUser(int userId)
        {
            var recipes = await _context.Recipes
                .Where(r => r.MyAppUserId == userId)
                .ToListAsync();

            return Ok(recipes);
        }

        public class RecipeUploadDto
        {
            public string DoctorFirstname { get; set; }
            public string DoctorLastname { get; set; }
            public int MyAppUserId { get; set; }
            public IFormFile? Scan { get; set; }
        }
    }
}
