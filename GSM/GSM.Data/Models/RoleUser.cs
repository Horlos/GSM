using Newtonsoft.Json;

namespace GSM.Data.Models
{
    public partial class RoleUser
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }


        [JsonIgnore]
        public virtual User User { get; set; }

        [JsonIgnore]
        public virtual Role Role { get; set; }
    }
}
