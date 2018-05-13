namespace TriggerDB.API.Models
{
    public class MRDuplexViewModel
    {
        public int Id { get; set; }
        public string ArrowheadDuplexId { get; set; }
        public int SenseStrandId { get; set; }
        public int AntiSenseStrandId { get; set; }
        public decimal? MW { get; set; }
        public string Notes { get; set; }

        public virtual TargetViewModel Target { get; set; }
    }
}