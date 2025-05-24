using Microsoft.AspNetCore.Mvc;

namespace NewPharmacy.Endpoints.MyAppUserEndpoints
{
    public class GetLoggedInUserEndpoint : Controller
    {
        [HttpGet]
        public IActionResult GetLoggedInUser()
        {
            var user = HttpContext.GetLoggedInUser(); // sada radi
            if (user == null)
                return Unauthorized();

            return Ok(user);
        }
    }
}
