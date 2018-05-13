using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class InstrumentModStructure : IEntity
    {
        public int InstrumentId { get; set; }
        public int ModStructureId { get; set; }
        public string Code { get; set; }

        [JsonIgnore]
        public virtual Instrument Instrument { get; set; }

        [JsonIgnore]
        public virtual ModStructure ModStructure { get; set; }
    }
}
