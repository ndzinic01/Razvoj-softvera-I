using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace NewPharmacy.Data.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int QuantityInStock { get; set; }
        public string Picture {  get; set; } 


        [ForeignKey(nameof(Category))]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public bool IsDiscounted { get; set; } = false;
        public decimal? DiscountPercentage { get; set; }// Nullable ako nije sniženo
        public double DiscountedPrice { get; set; }

        public DateTime? DatumDodavanja { get; set; }

        public void UpdateDiscountedPrice()
        {
            DiscountedPrice = IsDiscounted && DiscountPercentage.HasValue
                ? Price * (1 - (double)DiscountPercentage.Value / 100)
                : Price;
        }

        [ForeignKey(nameof(Brand))]
        public int? BrandId { get; set; }
        public Brand? Brand { get; set; }  // ✅ Nova relacija

        public DateTime? ExpiryDate { get; set; }

        public List<Review> Reviews { get; set; }
    }
}
