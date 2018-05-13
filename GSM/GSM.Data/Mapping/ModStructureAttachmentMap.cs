using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class ModStructureAttachmentMap : EntityTypeConfiguration<ModStructureAttachment>
    {
        public ModStructureAttachmentMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties

            this.Property(t => t.FileName)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ModStructureAttachment");
            this.Property(t => t.Id).HasColumnName("ModStructureAttachmentID");
            this.Property(t => t.ModStructureId).HasColumnName("ModStructureID");
            this.Property(t => t.FileName).HasColumnName("FileName");

            // Relationships
            this.HasRequired(t => t.ModStructure)
                .WithMany(t => t.ModStructureAttachments)
                .HasForeignKey(d => d.ModStructureId);

        }
    }
}
