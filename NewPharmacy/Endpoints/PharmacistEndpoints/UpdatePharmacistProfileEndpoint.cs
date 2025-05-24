//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using NewPharmacy.Data;
//using NewPharmacy.Data.Models;
//using NewPharmacy.Helper;
//using System.Security.Claims;

//namespace NewPharmacy.Endpoints.PharmacistEndpoints
//{
//    public class UpdatePharmacistProfileEndpoint : Controller
//    {
//        private readonly ApplicationDbContext _context;

//        public UpdatePharmacistProfileEndpoint(ApplicationDbContext context)
//        {
//            _context = context;
//        }

//        private readonly ILogger<UpdatePharmacistProfileEndpoint> _logger; // Dodaj logger u konstruktor

//        public UpdatePharmacistProfileEndpoint(ILogger<UpdatePharmacistProfileEndpoint> logger, ApplicationDbContext context)
//        {
//            _logger = logger;
//            _context = context;
//        }
//        [HttpPut("update-profile")]
//        [Authorize]
//        public async Task<IActionResult> UpdateProfile([FromForm] string email, [FromForm] IFormFile? profileImage)
//        {
//            _logger.LogInformation("Početak ažuriranja profila.");

//            var username = User.GetLoggedInUsername();
//            var user = await _context.MyAppUsers.FirstOrDefaultAsync(x => x.Username == username && x.IsPharmacist);

//            if (user == null)
//            {
//                _logger.LogError($"Korisnik sa korisničkim imenom {username} nije pronađen.");
//                return NotFound("Korisnik nije pronađen.");
//            }

//            _logger.LogInformation("Ažuriranje email-a korisnika.");
//            user.Email = email;

//            if (profileImage != null)
//            {
//                try
//                {
//                    _logger.LogInformation("Početak upload-a slike.");
//                    using var ms = new MemoryStream();
//                    await profileImage.CopyToAsync(ms);
//                    var imageBytes = ms.ToArray();

//                    // Ako koristiš Azure ili lokalno čuvanje
//                    string imageUrl = await FileHelper.UploadImageAsync(imageBytes, profileImage.FileName);
//                    user.ProfileImageUrl = imageUrl;

//                    _logger.LogInformation("Slika uspešno upload-ovana.");
//                }
//                catch (Exception ex)
//                {
//                    _logger.LogError($"Greška pri uploadu slike: {ex.Message}", ex);
//                    return StatusCode(500, "Greška pri uploadu slike.");
//                }
//            }

//            try
//            {
//                _logger.LogInformation("Spremanje podataka.");
//                await _context.SaveChangesAsync();
//                _logger.LogInformation("Podaci uspešno sačuvani.");
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError($"Greška pri spremanju podataka: {ex.Message}", ex);
//                return StatusCode(500, "Greška pri spremanju podataka.");
//            }

//            return Ok("Profil uspešno ažuriran.");
//        }





//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NewPharmacy.Data;
using NewPharmacy.Data.Models;
using NewPharmacy.Helper;
using System.Security.Claims;
using System.IO;

namespace NewPharmacy.Endpoints.PharmacistEndpoints
{
    public class UpdatePharmacistProfileEndpoint : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UpdatePharmacistProfileEndpoint> _logger;

        public UpdatePharmacistProfileEndpoint(ApplicationDbContext context, ILogger<UpdatePharmacistProfileEndpoint> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPut("update-profile")]
        [Authorize]
        public async Task<IActionResult> UpdateProfile([FromForm] string email, [FromForm] IFormFile? profileImage)
        {
            _logger.LogInformation("Početak ažuriranja profila.");

            var username = User.GetLoggedInUsername();
            var user = await _context.MyAppUsers.FirstOrDefaultAsync(x => x.Username == username && x.IsPharmacist);

            if (user == null)
            {
                _logger.LogError($"Korisnik sa korisničkim imenom {username} nije pronađen.");
                return NotFound("Korisnik nije pronađen.");
            }

            _logger.LogInformation("Ažuriranje email-a korisnika.");
            user.Email = email;

            if (profileImage != null)
            {
                try
                {
                    // Provjera tipa fajla (možeš dodati više vrsta slika)
                    if (!profileImage.ContentType.StartsWith("image/"))
                    {
                        _logger.LogError("Nevalidan tip fajla.");
                        return BadRequest("Dozvoljeni su samo tipovi slika.");
                    }

                    // Provjera veličine fajla (npr. maksimalno 5MB)
                    if (profileImage.Length > 5 * 1024 * 1024)
                    {
                        _logger.LogError("Fajl je prevelik.");
                        return BadRequest("Veličina fajla ne može biti veća od 5MB.");
                    }

                    _logger.LogInformation("Početak upload-a slike.");
                    using var ms = new MemoryStream();
                    await profileImage.CopyToAsync(ms);
                    var imageBytes = ms.ToArray();

                    // Ako koristiš Azure ili lokalno čuvanje
                    string imageUrl = await FileHelper.UploadImageAsync(imageBytes, profileImage.FileName);
                    user.ProfileImageUrl = imageUrl;

                    _logger.LogInformation("Slika uspešno upload-ovana.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Greška pri uploadu slike: {ex.Message}", ex);
                    return StatusCode(500, "Greška pri uploadu slike.");
                }
            }

            try
            {
                _logger.LogInformation("Spremanje podataka.");
                await _context.SaveChangesAsync();
                _logger.LogInformation("Podaci uspešno sačuvani.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Greška pri spremanju podataka: {ex.Message}", ex);
                return StatusCode(500, "Greška pri spremanju podataka.");
            }

            return Ok("Profil uspešno ažuriran.");
        }
    }
}
