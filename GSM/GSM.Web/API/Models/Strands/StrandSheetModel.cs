using System.Collections.Generic;

namespace GSM.API.Models.Strands
{
    public class StrandSheetModel
    {
        public string Sequence { get; set; }
        public string Target { get; set; }
        public string Orientation { get; set; }
        public string GenomeNumber { get; set; }
        public string GenomePosition { get; set; }
        public string ParentSequence { get; set; }
        public ICollection<string> ModStructures { get; set; }
    }
}