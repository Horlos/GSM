using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using GSM.Data.Common;

namespace GSM.Data.Models
{
    public partial class Duplex: IEntity
    {

        public Duplex()
        {
            DuplexId =  "NEW";
        }

        public Duplex(string duplexId)
        {
            DuplexId = string.IsNullOrEmpty(duplexId) ? "NEW" : DuplexId;
        }

        public int Id { get; set; }

        public string DuplexId { get; set; }

        public int SenseStrandId { get; set; }

        public int AntiSenseStrandId { get; set; }

        public int TargetId { get; set; }

        public decimal? MW { get; set; }

        public string Notes { get; set; }


        public virtual Target Target { get; set; }

        [ForeignKey("AntiSenseStrandId")]
        public virtual Strand AntiSenseStrand { get; set; }

        [ForeignKey("SenseStrandId")]
        public virtual Strand SenseStrand { get; set; }

        public virtual ICollection<DuplexMaterialRequest> MaterialRequests { get; set; }

        public virtual ICollection<DuplexBatch> Batches { get; set; }
    }
}
