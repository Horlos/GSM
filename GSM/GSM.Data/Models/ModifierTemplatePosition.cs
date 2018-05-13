using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class ModifierTemplatePosition: IEntity
    {
        public int Id { get; set; }
        public int ModifierTemplateId { get; set; }
        public int Position { get; set; }
        public string Mod { get; set; }

        [JsonIgnore]
        public virtual ModifierTemplate ModifierTemplate { get; set; }
    }
}
