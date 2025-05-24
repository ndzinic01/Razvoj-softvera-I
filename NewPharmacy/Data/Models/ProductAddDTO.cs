namespace NewPharmacy.Data.Models
{
    public class ProductAddDTO
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int QuantityInStock { get; set; }
        public string Picture { get; set; }
        public int CategoryId { get; set; }
        public bool IsDiscounted { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public int? BrandId { get; set; }
    }

}
