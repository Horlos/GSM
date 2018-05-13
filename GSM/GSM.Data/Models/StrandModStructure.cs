using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class StrandModStructure: IEntity
    {
        public int StrandId { get; set; }
        public int ModStructureId { get; set; }
        public int OrdinalPosition { get; set; }

        public virtual ModStructure ModStructure { get; set; }

        [JsonIgnore]
        public virtual Strand Strand { get; set; }
    }
}
