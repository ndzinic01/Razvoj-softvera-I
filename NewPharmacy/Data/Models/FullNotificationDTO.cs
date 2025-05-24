namespace NewPharmacy.Data.Models
{
    public class FullNotificationDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Message { get; set; }
        public DateTime Time { get; set; }
        public bool Read { get; set; }
        public int MyAppUserId { get; set; }
        public int OrderId { get; set; }
        public string Type {  get; set; }

        public Order? Order { get; set; }
        public List<OrderDetail>? OrderDetails { get; set; }

        public int? SenderId { get; set; } // DODAJ OVO
    }
}
