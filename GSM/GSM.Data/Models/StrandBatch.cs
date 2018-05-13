using System;
using DelegateDecompiler;
using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class StrandBatch: IEntity
    {
        public StrandBatch()
        {
        }

        public StrandBatch(string runId, string position)
        {
            BatchNumber = string.Format("{0}_{1}", runId, position);
        }

        public int Id { get; set; }

        public int StrandId { get; set; }

        public string BatchNumber { get; set; }

        public string Position { get; set; }

        public double? PreparedVolume { get; set; }

        public string RunId { get; set; }

        public bool Unavailable { get; set; }

        public DateTime InitiatedDate { get; set; }

        public string Notes { get; set; }

        public double MiscVolumeUsed { get; set; }

        public double? Purity { get; set; }

        public double? SynthesisScale { get; set; }

        public double? AmountPrepared { get; set; }

        [JsonIgnore]
        public virtual Strand Strand { get; set; }

        [Computed]
        public double? Concentration
        {
            get
            {
                return 1000 * AmountPrepared  / PreparedVolume;
            }
        }

        [Computed]
        public double? RemainingVolume
        {
            get
            {
                return PreparedVolume - MiscVolumeUsed;
            }
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
