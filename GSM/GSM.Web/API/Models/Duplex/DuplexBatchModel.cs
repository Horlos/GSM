using System;
using System.Collections.Generic;

namespace GSM.API.Models.Duplex
{
    public class DuplexBatchModel : APIModelBase
    {
        public int Id { get; set; }
        public string DuplexBatchNumber { get; set; }
        public int DuplexId { get; set; }
        public double? Purity { get; set; }
        public double? PreparedVolume { get; set; }
        public double MiscVolumeUsed { get; set; }
        public string Notes { get; set; }
        public bool Unavailable { get; set; }
        public DateTime PreparedDate { get; set; }
        public string Position { get; set; }
        public string RunId { get; set; }
        public double? Concentration { get; set; }
        public double? RemainingVolume { get; set; }
        public double? AmountRemaining { get; set; }

        public DuplexViewModel Duplex { get; set; }
        public ICollection<DuplexStrandBatchViewModel> StrandBatches { get; set; }
    }
}