using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;


namespace GSM.Data.Models.Mapping
{
    public class SynthesisRequestStrandMap : EntityTypeConfiguration<StrandSynthesisRequest>
    {
        public SynthesisRequestStrandMap()
        {
            // Primary Key
            this.HasKey(t => new { t.SynthesisRequestId, t.StrandId });

            // Properties
            this.Property(t => t.SynthesisRequestId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.StrandId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.ScaleUnit)
                .IsRequired()
                .HasMaxLength(4);

            // Table & Column Mappings
            this.ToTable("SynthesisRequestStrand");
            this.Property(t => t.SynthesisRequestId).HasColumnName("SynthesisRequestID");
            this.Property(t => t.StrandId).HasColumnName("StrandID");
            this.Property(t => t.Scale).HasColumnName("Scale");
            this.Property(t => t.ScaleUnit).HasColumnName("ScaleUnit");

            // Relationships
            this.HasRequired(t => t.Strand)
                .WithMany(t => t.SynthesisRequestStrands)
                .HasForeignKey(d => d.StrandId);
            this.HasRequired(t => t.SynthesisRequest)
                .WithMany(t => t.SynthesisRequestStrands)
                .HasForeignKey(d => d.SynthesisRequestId);

        }
    }
}
