using System.Collections.Generic;

namespace GSM.API.Models
{
    public class StrandViewModel
    {
        public int Id { get; set; }
        public string StrandId { get; set; }
        public int FirstPosition { get; set; }
        public decimal? MW { get; set; }
        public string Sequence { get; set; }
        public decimal? ExtinctionCoefficient { get; set; }
        public TargetViewModel Target { get; set; }
        public ICollection<StrandModStructureViewModel> StrandModStructures { get; set; }
    }
}