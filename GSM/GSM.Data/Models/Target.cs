using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Target: IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
