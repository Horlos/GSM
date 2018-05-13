namespace GSM.API.Models
{
    public class StrandSynthesisRequestViewModel
    {
        public int SynthesisRequestId { get; set; }
        public int StrandId { get; set; }
        public string Scale { get; set; }

        public virtual StrandViewModel Strand { get; set; }
    }
}