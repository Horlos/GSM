using System.Collections.Generic;
using Newtonsoft.Json;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class User : IEntity
    {
        public User()
        {
            MaterialRequests = new List<MaterialRequest>();
            Roles = new HashSet<RoleUser>();
        }

        public int Id { get; set; }

        public string Name { get; set; }

        public virtual ICollection<RoleUser> Roles { get; set; }

        [JsonIgnore]
        public virtual ICollection<MaterialRequest> MaterialRequests { get; set; }
    }
}
