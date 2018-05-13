using System.Collections.Generic;
using GSM.Data.Models;

namespace GSM.API.Models
{
    public class ModifierTemplateModel : APIModelBase
    {
        public int Id { get; set; }
        public string Name { get; set; }
        //public int OrientationID { get; set; }
        public Orientation Orientation { get; set; }
        public int FirstPosition { get; set; }
        public ICollection<ModifierTemplatePosition> ModifierTemplatePositions { get; set; }
    }
}