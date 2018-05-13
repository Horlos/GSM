using System.Collections.Generic;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Role : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<RolePermission> Permissions { get; set; }
        public virtual ICollection<RoleUser> RoleUsers { get; set; }
    }
}
