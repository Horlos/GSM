namespace GSM.API.Models.MaterialRequest
{
    public class StrandMaterialRequestViewModel
    {
        public int StrandId { get; set; }
        public decimal AmountRequested { get; set; }
        public StrandViewModel Strand { get; set; }
    }
}