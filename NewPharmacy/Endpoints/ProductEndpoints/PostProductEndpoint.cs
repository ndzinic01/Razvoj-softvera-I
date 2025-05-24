//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using NewPharmacy.Data;
//using NewPharmacy.Data.Models;


//namespace NewPharmacy.Endpoints.ProductEndpoints
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class PostProductEndpoint : ControllerBase
//    {
//        private readonly ApplicationDbContext _context;

//        public PostProductEndpoint(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        [HttpPost]
//        public IActionResult PostProduct([FromBody] Product product)
//        {
//            if (product == null)
//            {
//                return BadRequest("Product not found");
//            }

//            // Provjeri da li kategorija postoji u bazi
//            var category = _context.Categories.FirstOrDefault(c => c.Id == product.CategoryId);

//            if (category == null)
//            {
//                return BadRequest("Category not found");
//            }

//            // Poveži kategoriju s proizvodom
//            product.Category = category;

//            // Dodaj proizvod u bazu
//            _context.Products.Add(product);
//            _context.SaveChanges();

//            return CreatedAtRoute("GetProductById", new { id = product.Id }, product);


//        }


//    }
//}
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;


namespace NewPharmacy.Endpoints.ProductEndpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostProductEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostProductEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult PostProduct([FromBody] ProductAddDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid product data.");

            var category = _context.Categories.FirstOrDefault(c => c.Id == dto.CategoryId);
            if (category == null)
                return BadRequest("Category not found.");

            Product product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                QuantityInStock = dto.QuantityInStock,
                Picture = dto.Picture,
                CategoryId = dto.CategoryId,
                IsDiscounted = dto.IsDiscounted,
                DiscountPercentage = dto.DiscountPercentage,
                BrandId = dto.BrandId,
                DatumDodavanja = DateTime.Now
            };

            product.UpdateDiscountedPrice();

            _context.Products.Add(product);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        }

        // Pomoćna metoda za CreatedAtAction
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null)
                return NotFound();

            return Ok(product);
        }
    }
}
