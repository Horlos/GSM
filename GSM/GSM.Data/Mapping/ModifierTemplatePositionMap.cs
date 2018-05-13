using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class ModifierTemplatePositionMap : EntityTypeConfiguration<ModifierTemplatePosition>
    {
        public ModifierTemplatePositionMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Mod)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ModifierTemplatePosition");
            this.Property(t => t.Id).HasColumnName("ModifierTemplatePositionID");
            this.Property(t => t.ModifierTemplateId).HasColumnName("ModifierTemplateID");
            this.Property(t => t.Position).HasColumnName("Position");
            this.Property(t => t.Mod).HasColumnName("Mod");

            // Relationships
            this.HasRequired(t => t.ModifierTemplate)
                .WithMany(t => t.ModifierTemplatePositions)
                .HasForeignKey(d => d.ModifierTemplateId);

        }
    }
}
