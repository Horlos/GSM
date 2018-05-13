using System.Collections.Generic;
using GSM.API.Models.ModStructures;
using GSM.API.Models.Orientations;

namespace GSM.API.Models.Strands
{
    public class ImportedStrandViewModel
    {
        public int FirstPosition { get; set; }
        public string Sequence { get; set; }
        public string GenomeNumber { get; set; }
        public string GenomePosition { get; set; }
        public string ParentSequence { get; set; }
        public TargetModel Target { get; set; }
        public OrientationModel Orientation { get; set; }
        public ICollection<StrandModStructureModel> StrandModStructures { get; set; }
    }
}