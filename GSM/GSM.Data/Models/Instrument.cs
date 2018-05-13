using System.Collections.Generic;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Instrument : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public int MaxAmidites { get; set; }
        public virtual ICollection<InstrumentModStructure> InstrumentModStructures { get; set; }
    }
}
