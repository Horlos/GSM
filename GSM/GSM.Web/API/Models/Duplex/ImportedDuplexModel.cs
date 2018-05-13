namespace GSM.API.Models.Duplex
{
    public class ImportedDuplexModel:APIModelBase
    {
        public decimal? MW { get; set; }
        public string Notes { get; set; }
        public StrandModel AntiSenseStrand { get; set; }
        public StrandModel SenseStrand { get; set; }
        public TargetModel Target { get; set; }
    }
}