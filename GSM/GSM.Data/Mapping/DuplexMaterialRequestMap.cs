using System.Data.Entity.ModelConfiguration;
using GSM.Data.Models;

namespace GSM.Data.Mapping
{
    public class DuplexMaterialRequestMap :  EntityTypeConfiguration<DuplexMaterialRequest>
    {
        public DuplexMaterialRequestMap()
        {
            // Primary Key
            this.HasKey(t => new { t.MaterialRequestId, t.DuplexId });

            // Properties
            // Table & Column Mappings
            this.ToTable("MaterialRequestDuplex");
            this.Property(t => t.MaterialRequestId).HasColumnName("MaterialRequestID");
            this.Property(t => t.DuplexId).HasColumnName("DuplexID");
            this.Property(t => t.AmountRequested).HasColumnName("AmountRequested");

            // Relationships
            this.HasRequired(t => t.Duplex)
                .WithMany(t => t.MaterialRequests)
                .HasForeignKey(d => d.DuplexId);
            this.HasRequired(t => t.MaterialRequest)
                .WithMany(t => t.RequestedDuplexes)
                .HasForeignKey(d => d.MaterialRequestId);
        }
    }
}
