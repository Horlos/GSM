using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class InstrumentModStructureMap : EntityTypeConfiguration<InstrumentModStructure>
    {
        public InstrumentModStructureMap()
        {
            // Primary Key
            this.HasKey(t => new { t.InstrumentId, t.ModStructureId });

            // Properties
            this.Property(t => t.InstrumentId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.ModStructureId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.Code)
                .IsRequired()
                .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("InstrumentModStructure");
            this.Property(t => t.InstrumentId).HasColumnName("InstrumentID");
            this.Property(t => t.ModStructureId).HasColumnName("ModStructureID");
            this.Property(t => t.Code).HasColumnName("Code");

            // Relationships
            this.HasRequired(t => t.Instrument)
                .WithMany(t => t.InstrumentModStructures)
                .HasForeignKey(d => d.InstrumentId);
            this.HasRequired(t => t.ModStructure)
                .WithMany(t => t.InstrumentModStructures)
                .HasForeignKey(d => d.ModStructureId);

        }
    }
}
