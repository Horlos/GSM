using System;

namespace TriggerDB.API.Models
{
    public class MRStrandViewModel
    {
        public int StrandId { get; set; }
        public string ArrowheadStrandId { get; set; }
        public int TargetId { get; set; }
        public int OrientationId { get; set; }
        public string GenomeNumber { get; set; }
        public string GenomePosition { get; set; }
        public string ParentSequence { get; set; }
        public string Sequence { get; set; }
        public string BaseSequence { get; set; }
        public string Notes { get; set; }
        public Nullable<int> FirstPosition { get; set; }
        public Nullable<decimal> MW { get; set; }
        public Nullable<decimal> ExtinctionCoefficient { get; set; }
        public Nullable<int> ColumnIdentity { get; set; }
        public virtual TargetViewModel Target { get; set; }
        public virtual OrientationViewModel Orientation { get; set; }

    }
}