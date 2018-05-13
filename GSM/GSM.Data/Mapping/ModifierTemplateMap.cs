using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class ModifierTemplateMap : EntityTypeConfiguration<ModifierTemplate>
    {
        public ModifierTemplateMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ModifierTemplate");
            this.Property(t => t.Id).HasColumnName("ModifierTemplateID");
            this.Property(t => t.Name).HasColumnName("Name");
            this.Property(t => t.OrientationId).HasColumnName("OrientationID");
            this.Property(t => t.FirstPosition).HasColumnName("FirstPosition");

            // Relationships
            this.HasRequired(t => t.Orientation)
                .WithMany(t => t.ModifierTemplates)
                .HasForeignKey(d => d.OrientationId);
        }
    }
}
