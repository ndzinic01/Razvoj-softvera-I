using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NewPharmacy.Data.Models.Auth;

public class MyAppUser
{
    [Key]
    public int ID { get; set; }
    public string Username { get; set; }
    [JsonIgnore]
    public string Password { get; set; }

    // Dodatna svojstva
    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string? PhoneNumber { get; set; }

    // Osnovne informacije o tipu korisnika
    public bool IsAdmin { get; set; }
    public bool IsPharmacist { get; set; }
    public bool IsCustomer { get; set; }

    // Dodatni podaci specifični za farmaceuta
    public DateTime? EmploymentDate { get; set; }  
    public string? Email { get; set; }
    public string? ProfileImageUrl { get; set; }
}
