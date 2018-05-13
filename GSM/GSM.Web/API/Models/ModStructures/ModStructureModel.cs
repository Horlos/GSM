using System.Collections.Generic;
using GSM.Data.Models;

namespace GSM.API.Models
{
    public class ModStructureModel : APIModelBase
    {
        public int Id { get; set; }
        public int ModStructureTypeId { get; set; }
        public string Name { get; set; }
        public string Base { get; set; }
        public decimal StartingMaterialMW { get; set; }
        public string VendorName { get; set; }
        public string VendorCatalogNumber { get; set; }
        public string Coupling { get; set; }
        public string Deprotection { get; set; }
        public decimal IncorporatedMW { get; set; }
        public string Formula { get; set; }
        public string DisplayColor { get; set; }
        public string Notes { get; set; }
        public bool HasAssociations { get; set; }
        public ModStructureType ModStructureType { get; set; }
        public ICollection<AttachmentInfo> Attachments { get; set; }
        public ICollection<InstrumentModStructure> InstrumentModStructures { get; set; }
    }
}