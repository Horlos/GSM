using System.Collections.Generic;

namespace GSM.API.Models.ModStructures
{
    public class ModStructureViewModel
    {
        public int Id { get; set; }
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
        public int ModStructureTypeId { get; set; }
        public ICollection<InstrumentModStructureViewModel> InstrumentModStructures { get; set; }
    }
}