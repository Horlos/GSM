using System;
using System.Collections.Generic;

namespace GSM.API.Models.Duplex
{
    public class DuplexBatchViewModel
    {
        public int Id { get; set; }
        public string DuplexBatchNumber { get; set; }
        public DateTime PreparedDate { get; set; }
        public string RunId { get; set; }
        public string DuplexId { get; set; }
        public bool Unavailable { get; set; }
        public double? AmountRemaining { get; set; }
        public TargetViewModel Target { get; set; }
        public DuplexViewModel Duplex { get; set; }
        public ICollection<DuplexStrandBatchViewModel> StrandBatches { get; set; }
    }
}