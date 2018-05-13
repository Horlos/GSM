namespace GSM.API.Models.ModStructures
{
    public class StrandModStructureModel : APIModelBase
    {
        public int StrandId { get; set; }
        public int OrdinalPosition { get; set; }
        public int ModStructureId { get; set; }
        public virtual ModStructureModel ModStructure { get; set; }
    }
}