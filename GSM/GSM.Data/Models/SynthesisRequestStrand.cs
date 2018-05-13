namespace GSM.Data.Models
{
    public partial class StrandSynthesisRequest
    {
        public int SynthesisRequestId { get; set; }
        public int StrandId { get; set; }
        public decimal Scale { get; set; }
        public string ScaleUnit { get; set; }

        public virtual Strand Strand { get; set; }
        public virtual SynthesisRequest SynthesisRequest { get; set; }
    }
}
