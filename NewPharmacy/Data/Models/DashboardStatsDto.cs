namespace NewPharmacy.Data.Models
{
    public class DailySaleDto
    {
        public string Date { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
    public class DashboardStatsDto
    {
        
        public decimal MonthlySales { get; set; }
        public int OrderCount { get; set; }
        public int UserCount { get; set; }
        public int StockCount { get; set; }
        public List<DailySaleDto> DailySalesData { get; set; } = new();
    }
}
