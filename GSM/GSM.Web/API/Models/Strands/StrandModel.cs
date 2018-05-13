using System.Collections.Generic;
using GSM.Data.Models;

namespace GSM.API.Models
{
    public class StrandModel : APIModelBase
    {
        public int Id { get; set; }
        public int TargetId { get; set; }
        public int OrientationId { get; set; }
        public string StrandId { get; set; }
        public string GenomeNumber { get; set; }
        public string GenomePosition { get; set; }
        public string ParentSequence { get; set; }
        public int FirstPosition { get; set; }
        public decimal? MW { get; set; }
        public decimal? ExtinctionCoefficient { get; set; }
        public string Notes { get; set; }
        public string ColumnIdentity { get; set; }
        public string Sequence { get; set; }
        public string BaseSequence { get; set; }
        public bool HasAssociations { get; set; }
        public Target Target { get; set; }
        public Orientation Orientation { get; set; }
        public ICollection<StrandModStructureViewModel> StrandModStructures { get; set; }
        public ICollection<SpeciesViewModel> Species { get; set; }
        public ICollection<StrandBatchViewModel> Batches { get; set; }

    }
}