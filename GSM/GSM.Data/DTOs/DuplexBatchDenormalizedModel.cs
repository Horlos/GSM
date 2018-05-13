using System;
using GSM.Data.Models;

namespace GSM.Data.DTOs
{
    using DelegateDecompiler;

    public class DuplexBatchDenormalizedModel
    {
        public int Id { get; set; }
        public int DuplexId { get; set; }
        public int StrandBatchId { get; set; }
        public string DuplexBatchNumber { get; set; }
        public double? Purity { get; set; }
        public double? PreparedVolume { get; set; }
        public double MiscVolumeUsed { get; set; }
        public string Notes { get; set; }
        public bool Unavailable { get; set; }
        public DateTime PreparedDate { get; set; }
        public string Position { get; set; }
        public string RunId { get; set; }
        public double? Concentration { get; set; }

        [Computed]
        public double? RemainingVolume
        {
            get { return PreparedVolume - MiscVolumeUsed; }
        }

        [Computed]
        public double? AmountRemaining
        {
            get
            {
                return Concentration * RemainingVolume / 1000;
            }
        }
        public virtual Duplex Duplex { get; set; }
        public double? TotalUsed { get; set; }
        public Target Target { get; set; }
        public StrandBatch SenseStrandBatch { get; set; }
        public StrandBatch AntisenseStrandBatch { get; set; }

    }
}
