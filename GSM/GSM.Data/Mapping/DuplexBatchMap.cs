using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class DuplexBatchMap : EntityTypeConfiguration<DuplexBatch>
    {
        public DuplexBatchMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties


            // Table & Column Mappings
            this.ToTable("DuplexBatch");
            this.Property(t => t.Id).HasColumnName("DuplexBatchID");
            this.Property(t => t.DuplexId).HasColumnName("DuplexID");
            this.Property(t => t.DuplexBatchNumber).HasColumnName("DuplexBatchNumber");
            this.Property(t => t.Purity).HasColumnName("Purity");
            this.Property(t => t.PreparedVolume).HasColumnName("PreparedVolume");
            this.Property(t => t.MiscVolumeUsed).HasColumnName("MiscVolumeUsed");
            this.Property(t => t.Notes).HasColumnName("Notes");
            this.Property(t => t.Unavailable).HasColumnName("Unavailable");
            this.Property(t => t.PreparedDate).HasColumnName("DatePrepared");
            this.Property(t => t.Position).HasColumnName("Position");
            this.Property(t => t.RunId).HasColumnName("RunID");
            this.Property(t => t.Concentration).HasColumnName("Concentration");

            // Relationships
            this.HasRequired(t => t.Duplex)
                .WithMany(d => d.Batches)
                .HasForeignKey(d => d.DuplexId);
        }
    }
}
