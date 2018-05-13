namespace GSM.API.Models.Duplex
{
    public class DuplexViewModel
    {
        public int Id { get; set; }
        public string DuplexId { get; set; }
        public int TargetId { get; set; }
        public int SenseStrandId { get; set; }  
        public int AntiSenseStrandId { get; set; }
        public decimal? MW { get; set; }
        public string Notes { get; set; }
        public virtual TargetViewModel Target { get; set; }
        public virtual StrandViewModel AntiSenseStrand { get; set; }
        public virtual StrandViewModel SenseStrand { get; set; }
    }
}