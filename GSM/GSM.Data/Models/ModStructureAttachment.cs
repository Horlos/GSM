using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class ModStructureAttachment : IEntity
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public int ModStructureId { get; set; }

        [JsonIgnore]
        public virtual ModStructure ModStructure { get; set; }
    }
}
