namespace NewPharmacy.Data.Models
{
    public class OrderItemDTO
    {
        public int ProductId { get; set; }
        public int Qty { get; set; }
        public double PricePerUnit { get; set; }
    }

    public class OrderCreateDTO
    {
        public int MyAppUserId { get; set; }

        // Podaci o korisniku
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        // Adresa
        public string Address { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }

        // Narudžba
        public decimal TotalPrice { get; set; }
        public string? PaymentMethod { get; set; }

        public string? CardNumber { get; set; }
        public string? ExpiryDate { get; set; }
        public string? CVV { get; set; }

        // ➕ Nova lista stavki
        public List<OrderItemDTO> Items { get; set; } = new();
    }


}