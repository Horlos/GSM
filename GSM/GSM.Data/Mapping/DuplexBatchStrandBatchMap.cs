using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class DuplexBatchStrandBatchMap : EntityTypeConfiguration<DuplexBatchStrandBatch>
    {
        public DuplexBatchStrandBatchMap()
        {
            // Primary Key
            this.HasKey(t => new { t.DuplexBatchId, t.StrandBatchId});

            // Properties
            this.Property(t => t.DuplexBatchId)
               .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.StrandBatchId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            // Table & Column Mappings
            this.ToTable("DuplexBatchStrandBatch");
            this.Property(t => t.DuplexBatchId).HasColumnName("DuplexBatchID");
            this.Property(t => t.StrandBatchId).HasColumnName("StrandBatchID");
            this.Property(t => t.TotalUsed).HasColumnName("TotalUsed");

            // Relationships
            this.HasRequired(t => t.StrandBatch)
                .WithMany()
                .HasForeignKey(d => d.StrandBatchId);
            this.HasRequired(t => t.DuplexBatch)
                .WithMany(t=>t.DuplexBatchStrandBatches)
                .HasForeignKey(d => d.DuplexBatchId);
        }
    }
}
