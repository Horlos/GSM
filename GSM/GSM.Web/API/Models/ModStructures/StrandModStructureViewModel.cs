using GSM.API.Models.ModStructures;

namespace GSM.API.Models
{
    public class StrandModStructureViewModel
    {
        public int StrandId { get; set; }
        public int OrdinalPosition { get; set; }
        public int ModStructureId { get; set; }
        public virtual ModStructureViewModel ModStructure { get; set; }
    }
}