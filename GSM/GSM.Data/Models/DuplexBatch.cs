using System;
using System.Collections.Generic;
using DelegateDecompiler;
using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class DuplexBatch: IEntity
    {
        public DuplexBatch()
        {
        }

        public DuplexBatch(string runId, string position)
        {
            RunId = runId;
            Position = position;
            DuplexBatchNumber = string.Format("{0}_{1}", RunId, Position);
        }

        public int Id { get; set; }
        public int DuplexId { get; set; }
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

        [JsonIgnore]
        public virtual Duplex Duplex { get; set; }

        [JsonIgnore]
        public virtual ICollection<DuplexBatchStrandBatch> DuplexBatchStrandBatches { get; set; }

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
    }
}
