using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class StrandMap : EntityTypeConfiguration<Strand>
    {
        public StrandMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.StrandId)
                .IsRequired()
                .HasMaxLength(255);

            this.Property(t => t.GenomeNumber)
                .HasMaxLength(255);

            this.Property(t => t.GenomePosition)
                .HasMaxLength(255);

            this.Property(t => t.ParentSequence)
                .HasMaxLength(255);

            this.Property(t => t.Sequence)
                .HasMaxLength(2000);

            this.Property(t => t.BaseSequence)
                .HasMaxLength(2000);

            // Table & Column Mappings
            this.ToTable("Strand");
            this.Property(t => t.Id).HasColumnName("ID");
            this.Property(t => t.StrandId).HasColumnName("StrandID");
            this.Property(t => t.TargetId).HasColumnName("TargetID");
            this.Property(t => t.OrientationId).HasColumnName("OrientationID");
            this.Property(t => t.GenomeNumber).HasColumnName("GenomeNumber");
            this.Property(t => t.GenomePosition).HasColumnName("GenomePosition");
            this.Property(t => t.ParentSequence).HasColumnName("ParentSequence");
            this.Property(t => t.Sequence).HasColumnName("Sequence");
            this.Property(t => t.FirstPosition).HasColumnName("FirstPosition");
            this.Property(t => t.BaseSequence).HasColumnName("BaseSequence");
            this.Property(t => t.MW).HasColumnName("MW");
            this.Property(t => t.ExtinctionCoefficient).HasColumnName("ExtinctionCoefficient");
            this.Property(t => t.Notes).HasColumnName("Notes");

            // Relationships
            this.HasRequired(t => t.Target);
            this.HasRequired(t => t.Orientation);
        }
    }
}
