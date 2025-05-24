using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Data;

namespace NewPharmacy.Endpoints
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteMyAppUserEndpoint : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeleteMyAppUserEndpoint(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMyAppUser(int id)
        {
            var myAppUser = _context.MyAppUsers.FirstOrDefault(u => u.ID == id);

            if (myAppUser == null)
                return NotFound($"App User with Id {id} not found.");

            _context.MyAppUsers.Remove(myAppUser);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
