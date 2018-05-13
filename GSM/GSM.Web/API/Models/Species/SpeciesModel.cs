namespace GSM.API.Models
{
    public class SpeciesModel : APIModelBase
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public bool HasAssociations { get; set; }
    }
}