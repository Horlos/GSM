using System.Collections.Generic;
using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class ModStructure : IEntity
    {
        public int Id { get; set; }
        public int ModStructureTypeId { get; set; }
        public string Name { get; set; }
        public string Base { get; set; }
        public string VendorName { get; set; }
        public string VendorCatalogNumber { get; set; }
        public string Coupling { get; set; }
        public string Deprotection { get; set; }
        public decimal IncorporatedMW { get; set; }
        public decimal StartingMaterialMW { get; set; }
        public string Formula { get; set; }
        public string DisplayColor { get; set; }
        public string Notes { get; set; }

        public virtual ModStructureType ModStructureType { get; set; }
        public virtual ICollection<InstrumentModStructure> InstrumentModStructures { get; set; }
        public virtual ICollection<ModStructureAttachment> ModStructureAttachments { get; set; }

        [JsonIgnore]
        public virtual ICollection<StrandModStructure> StrandModStructures { get; set; }
    }
}
