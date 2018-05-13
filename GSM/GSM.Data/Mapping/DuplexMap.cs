using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class DuplexMap : EntityTypeConfiguration<Duplex>
    {
        public DuplexMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.DuplexId)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("Duplex");
            this.Property(t => t.Id).HasColumnName("ID");
            this.Property(t => t.DuplexId).HasColumnName("DuplexID");
            this.Property(t => t.SenseStrandId).HasColumnName("SenseStrandID");
            this.Property(t => t.AntiSenseStrandId).HasColumnName("AntiSenseStrandID");
            this.Property(t => t.TargetId).HasColumnName("TargetID");
            this.Property(t => t.MW).HasColumnName("MW");
            this.Property(t => t.Notes).HasColumnName("Notes");

            // Relationships
            this.HasMany(t => t.MaterialRequests)
                .WithRequired(t => t.Duplex);

            this.HasRequired(t => t.AntiSenseStrand);
            this.HasRequired(t => t.SenseStrand);
                
            this.HasRequired(t => t.Target);

        }
    }
}
