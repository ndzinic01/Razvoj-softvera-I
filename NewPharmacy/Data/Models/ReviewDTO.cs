namespace NewPharmacy.Data.Models
{
    public class ReviewDTO
    {
        public string UserName { get; set; }
        public int Rating { get; set; }
        public string Text { get; set; }
        public int ProductId { get; set; }
    }
}
