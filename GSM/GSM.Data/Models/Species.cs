using System.Collections.Generic;
using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Species: IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }

        [JsonIgnore]
        public virtual ICollection<Strand> Strands { get; set; }
    }
}
