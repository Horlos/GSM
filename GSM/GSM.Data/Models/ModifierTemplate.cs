using System.Collections.Generic;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class ModifierTemplate : IEntity
    {
        public int Id { get; set; }
        public int OrientationId { get; set; }
        public string Name { get; set; }
        public int FirstPosition { get; set; }

        public virtual Orientation Orientation { get; set; }
        public virtual ICollection<ModifierTemplatePosition> ModifierTemplatePositions { get; set; }
    }
}
