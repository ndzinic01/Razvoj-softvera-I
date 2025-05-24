    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Http;
    using NewPharmacy.Data;
    using NewPharmacy.Helper.Api;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;

    namespace NewPharmacy.Endpoints.DataSeedEndpoints
    {
        [Route("data-seed")]
        public class DataSeedCountEndpoint(ApplicationDbContext db)
            : MyEndpointBaseAsync
            .WithoutRequest
            .WithResult<Dictionary<string, int>>
        {
            [HttpGet]
            public override async Task<Dictionary<string, int>> HandleAsync(CancellationToken cancellationToken = default)
            {
                Dictionary<string, int> dataCounts = new()
                {
                    { "MyAppUser", db.MyAppUsers.Count() },
                    { "Product", db.Products.Count() },
                    { "Category", db.Categories.Count() },
                    { "Supplier", db.Suppliers.Count() }
                };

                return dataCounts;
            }
        }
    }