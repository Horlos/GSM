using System.ComponentModel.DataAnnotations;

namespace GSM.Models
{
    public class ForgotViewModel
    {
        [Required]
        [Display(Name = "User Name")]
        public string UserName { get; set; }
    }
}