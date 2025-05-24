using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;
using NewPharmacy.Data.Models.Auth;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class PutMyAppUserEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PutMyAppUserEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPut("PutMyAppUserEndpoint/{id}")]
public IActionResult Update(int id, [FromBody] UpdateMyAppUserDTO dto)
{
    if (id != dto.ID)
    {
        return BadRequest("ID u URL-u i tijelu zahtjeva se ne podudaraju.");
    }

    var user = _context.MyAppUsers.Find(id);
    if (user == null)
    {
        return NotFound();
    }

    // Ažuriramo podatke korisnika
    user.Username = dto.Username;
    user.FirstName = dto.FirstName;
    user.LastName = dto.LastName;
    user.IsAdmin = dto.IsAdmin;
    user.IsPharmacist = dto.IsPharmacist;
    user.IsCustomer = dto.IsCustomer;

    _context.SaveChanges();
    return Ok(user);
}

    }
}