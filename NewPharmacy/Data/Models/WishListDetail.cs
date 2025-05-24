using NewPharmacy.Data.Models.Auth;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NewPharmacy.Data.Models
{
    public class WishListDetail
    {
        [Key]
        public int Id { get; set; }


        [ForeignKey(nameof(WishList))]
        public int WishListId { get; set; }
        public WishList? WishList { get; set; }


        [ForeignKey(nameof(MyAppUser))]
        public int MyAppUserId { get; set; }
        public MyAppUser? MyAppUser { get; set; }

        public int Quantity { get; set; }
    }
}