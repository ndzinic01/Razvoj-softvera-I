//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;

//namespace NewPharmacy.Endpoints.AuthEndpoint
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class LoginEndpoint : ControllerBase
//    {
//    }
//}
using Azure;
using Microsoft.AspNetCore.Mvc;
using NewPharmacy.Helper.Api;
using NewPharmacy.Services;
using System.Threading;
using System.Threading.Tasks;
using static NewPharmacy.Endpoints.AuthEndpoints.AuthGetEndpoint;

namespace NewPharmacy.Endpoints.AuthEndpoints
{
    [Route("auth")]
    public class AuthGetEndpoint(MyAuthService authService) : MyEndpointBaseAsync
        .WithoutRequest
        .WithActionResult<AuthGetResponse>
    {
        [HttpGet]
        public override async Task<ActionResult<AuthGetResponse>> HandleAsync(CancellationToken cancellationToken = default)
        {
            // Retrieve user info based on the token
            var authInfo = authService.GetAuthInfo();

            if (!authInfo.IsLoggedIn)
            {
                return Unauthorized("Invalid or expired token");
            }

            // Return user information if the token is valid
            return Ok(new AuthGetResponse
            {
                MyAuthInfo = authInfo
            });
        }

        public class AuthGetResponse
        {
            public required MyAuthInfo MyAuthInfo { get; set; }
        }
    }
}

