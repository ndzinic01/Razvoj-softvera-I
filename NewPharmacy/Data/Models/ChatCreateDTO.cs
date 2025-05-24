namespace NewPharmacy.Data.Models
{
    public class ChatCreateDTO
    {
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }

        public string Message { get; set; }
        public string TypeOfMessage { get; set; } // "pitanje", "odgovor"
        public string Status { get; set; } = "nepročitano";

        public bool IsResponse { get; set; } = false;
    }


}
