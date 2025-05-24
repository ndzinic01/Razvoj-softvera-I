namespace NewPharmacy.Data.Models.Auth
{
    public class UpdateMyAppUserDTO
    {
        public int ID { get; set; }          // ID korisnika, bitan za ažuriranje
        public string Username { get; set; } // Username se može mijenjati, ako je potrebno
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public bool IsAdmin { get; set; }
        public bool IsPharmacist { get; set; }
        public bool IsCustomer { get; set; }
    }
}
