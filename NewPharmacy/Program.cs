using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using NewPharmacy.Data;
using NewPharmacy.Services;
using NewPharmacy.Helper.Auth;
using Microsoft.AspNetCore.Http;
using NewPharmacy.Helper;

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", false)
    .Build();

var builder = WebApplication.CreateBuilder(args);

// Baza podataka
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(config.GetConnectionString("db1")));

// Servisi
builder.Services.AddControllers();
builder.Services.AddScoped<ProductService>();
builder.Services.AddTransient<MyAuthService>(); // Servis za autentifikaciju
builder.Services.AddScoped<AzureBlobService>();
builder.Services.AddSession();

// CORS konfiguracija
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
        builder.WithOrigins("http://localhost:4200") // Pobrinite se da frontend koristi ovaj URL
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());  // Ako koristite autentifikaciju (kolaèiæi ili header token)
});

// Redis cache (ako je potrebno)
builder.Services.AddDistributedMemoryCache();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(x => x.OperationFilter<MyAuthorizationSwaggerHeader>());

// HTTPContextAccessor
builder.Services.AddHttpContextAccessor();

// Dodavanje autentifikacije (npr. JWT)
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = "https://localhost:5000"; // URL vašeg identifikacionog servera (ako koristite IdentityServer ili Auth0)
        options.Audience = "api1"; // Postavite na identifikator vašeg API-ja
    });


var app = builder.Build();

// HTTP pipeline
app.UseSwagger();
app.UseSwaggerUI();

// Redosled middleware-a je važan
app.UseCors("AllowAngularApp"); // Omoguæite CORS pre nego što idete na autentifikaciju i sesije
app.UseAuthentication();  // Ovaj middleware treba da bude pre UseAuthorization
app.UseAuthorization();   // Ovaj middleware treba da bude posle UseAuthentication

app.UseSession(); // Omoguæite sesije
app.UseStaticFiles(); // Omoguæite statièke fajlove (slike, CSS, JS)

app.MapControllers();
app.Run();
