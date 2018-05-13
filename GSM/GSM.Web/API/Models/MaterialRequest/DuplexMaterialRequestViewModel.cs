using GSM.API.Models.Duplex;

namespace GSM.API.Models.MaterialRequest
{
    public class DuplexMaterialRequestViewModel
    {
        public int DuplexId { get; set; }
        public decimal AmountRequested { get; set; }
        public DuplexViewModel Duplex { get; set; }
    }
}