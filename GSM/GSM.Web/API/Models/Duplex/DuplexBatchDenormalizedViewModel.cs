using System;

namespace GSM.API.Models.Duplex
{
    public class DuplexBatchDenormalizedViewModel
    {
        public int Id { get; set; }
        public string DuplexBatchNumber { get; set; }
        public DateTime PreparedDate { get; set; }
        public string RunId { get; set; }
        public double? Purity { get; set; }
        public double? AmountRemaining { get; set; }
        public bool Unavailable { get; set; }
        public TargetViewModel Target { get; set; }
        public DuplexViewModel Duplex { get; set; }

        public double? TotalUsed { get; set; }
        public StrandBatchViewModel SenseStrandBatch { get; set; }
        public StrandBatchViewModel AntisenseStrandBatch { get; set; }
    }
}