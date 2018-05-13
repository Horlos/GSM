namespace GSM.API.Models
{
    public class InstrumentModel : APIModelBase
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int MaxAmidites { get; set; }
        public bool IsActive { get; set; }
    }
}