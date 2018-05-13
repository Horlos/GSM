using System.Collections.Generic;
using Newtonsoft.Json;

namespace GSM.Data.Models
{
    public partial class Orientation
    {
        public int Id { get; set; }

        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<ModifierTemplate> ModifierTemplates { get; set; }
    }
}
