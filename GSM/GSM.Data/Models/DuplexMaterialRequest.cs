using GSM.Data.Common;

namespace GSM.Data.Models
{
    public class DuplexMaterialRequest: IEntity
    {
        public int MaterialRequestId { get; set; }
        public int DuplexId { get; set; }
        public decimal AmountRequested { get; set; }

        public virtual Duplex Duplex { get; set; }
        public virtual MaterialRequest MaterialRequest { get; set; }
    }
}
