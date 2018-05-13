namespace GSM.API.Models.ModifierTemplates
{
    public class ModifierTemplateViewModel
    {
        public int Id { get; set; }
        public int OrientationId { get; set; }
        public string Name { get; set; }
        public int FirstPosition { get; set; }
        public OrientationViewModel Orientation { get; set; }
    }
}