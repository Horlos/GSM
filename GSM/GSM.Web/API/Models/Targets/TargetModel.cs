namespace GSM.API.Models
{
    public class TargetModel : APIModelBase
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public bool HasAssociations { get; set; }
    }
}