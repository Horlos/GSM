using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class StrandBatchMap : EntityTypeConfiguration<StrandBatch>
    {
        public StrandBatchMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.BatchNumber)
               .HasMaxLength(50);

            this.Property(t => t.Position)
               .HasMaxLength(50);

            this.Property(t => t.RunId)
               .HasMaxLength(50);

            this.Property(t => t.Purity)
                .IsOptional();

            this.Property(t => t.PreparedVolume)
                .IsOptional();

            this.Property(t => t.MiscVolumeUsed)
               .IsOptional();

            this.Property(t => t.SynthesisScale)
              .IsOptional();

            this.Property(t => t.AmountPrepared)
             .IsOptional();

            this.Property(t => t.Notes)
              .IsOptional();

            this.Property(t => t.Position)
              .IsOptional();

            this.Property(t => t.BatchNumber)
             .IsRequired();

            this.Property(t => t.RunId)
              .IsRequired();

            // Table & Column Mappings
            this.ToTable("StrandBatch");
            this.Property(t => t.Id).HasColumnName("StrandBatchID");
            this.Property(t => t.StrandId).HasColumnName("StrandID");
            this.Property(t => t.BatchNumber).HasColumnName("BatchNumber");
            this.Property(t => t.Purity).HasColumnName("Purity");
            this.Property(t => t.PreparedVolume).HasColumnName("PreparedVolume_ul");
            this.Property(t => t.MiscVolumeUsed).HasColumnName("MiscVolumeUsed");
            this.Property(t => t.Notes).HasColumnName("Notes");
            this.Property(t => t.Unavailable).HasColumnName("Unavailable");
            this.Property(t => t.InitiatedDate).HasColumnName("InitiatedDate");
            this.Property(t => t.Position).HasColumnName("Position");
            this.Property(t => t.RunId).HasColumnName("RunID");
            this.Property(t => t.SynthesisScale).HasColumnName("SynthesisScale");
            this.Property(t => t.AmountPrepared).HasColumnName("AmountPrepared");

            // Relationships
            this.HasRequired(t => t.Strand)
               .WithMany(t => t.Batches)
               .HasForeignKey(d => d.StrandId);
        }
    }
}
