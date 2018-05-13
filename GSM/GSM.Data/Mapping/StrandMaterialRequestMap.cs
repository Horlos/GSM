using System.Data.Entity.ModelConfiguration;
using GSM.Data.Models;

namespace GSM.Data.Mapping
{
    public class StrandMaterialRequestMap : EntityTypeConfiguration<StrandMaterialRequest>
    {
        public StrandMaterialRequestMap()
        {
            // Primary Key
            this.HasKey(t => new { t.MaterialRequestId, t.StrandId });

            // Properties
            // Table & Column Mappings
            this.ToTable("MaterialRequestStrand");
            this.Property(t => t.MaterialRequestId).HasColumnName("MaterialRequestID");
            this.Property(t => t.StrandId).HasColumnName("StrandID");
            this.Property(t => t.AmountRequested).HasColumnName("AmountRequested");

            // Relationships
            this.HasRequired(t => t.Strand)
                .WithMany(t => t.MaterialRequests)
                .HasForeignKey(d => d.StrandId);
            this.HasRequired(t => t.MaterialRequest)
                .WithMany(t => t.RequestedStrands)
                .HasForeignKey(d => d.MaterialRequestId);
        }
    }
}
