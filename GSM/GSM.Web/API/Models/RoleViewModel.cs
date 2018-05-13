using System.Collections.Generic;

namespace GSM.API.Models
{
    public class RoleViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<RolePermissionViewModel> Permissions { get; set; }
        public ICollection<RoleUserViewModel> Users { get; set; }
    }
}