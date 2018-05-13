using GSM.Data.Common;

namespace GSM.Data.Models
{
    public class StrandMaterialRequest: IEntity
    {
        public int MaterialRequestId { get; set; }
        public int StrandId { get; set; }
        public decimal AmountRequested { get; set; }

        public virtual Strand Strand { get; set; }
        public virtual MaterialRequest MaterialRequest { get; set; }
    }
}
