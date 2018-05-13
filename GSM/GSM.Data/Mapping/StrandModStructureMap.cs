using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class StrandModStructureMap : EntityTypeConfiguration<StrandModStructure>
    {

        public StrandModStructureMap()
        {
            // Primary Key
            this.HasKey(t => new { t.StrandId, t.OrdinalPosition});

            // Properties
            this.Property(t => t.StrandId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.OrdinalPosition)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            // Table & Column Mappings
            this.ToTable("StrandModStructure");
            this.Property(t => t.StrandId).HasColumnName("StrandID");
            this.Property(t => t.OrdinalPosition).HasColumnName("OrdinalPosition");
            this.Property(t => t.ModStructureId).HasColumnName("ModStructureID");

            // Relationships
            this.HasRequired(t => t.ModStructure)
                .WithMany(t => t.StrandModStructures)
                .HasForeignKey(d => d.ModStructureId);
            this.HasRequired(t => t.Strand)
                .WithMany(t => t.StrandModStructures)
                .HasForeignKey(d => d.StrandId);

        }

    }
}
