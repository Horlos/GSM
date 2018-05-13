using GSM.Data.Common;

namespace GSM.Data.Models
{
    public class RolePermission: IEntity
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }

        public virtual Role Role { get; set; }
        public virtual Permission Permission { get; set; }
    }
}
