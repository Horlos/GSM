using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class ModStructureMap : EntityTypeConfiguration<ModStructure>
    {
        public ModStructureMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            this.Property(t => t.Base)
               .HasMaxLength(255);

            this.Property(t => t.VendorName)
                .HasMaxLength(255);

            this.Property(t => t.VendorCatalogNumber)
                .HasMaxLength(255);

            this.Property(t => t.Coupling)
                .HasMaxLength(255);

            this.Property(t => t.Deprotection)
                .HasMaxLength(255);

            this.Property(t => t.Formula)
                .HasMaxLength(255);

            this.Property(t => t.DisplayColor)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ModStructure");
            this.Property(t => t.Id).HasColumnName("ModStructureID");
            this.Property(t => t.Name).HasColumnName("Name");
            this.Property(t => t.Base).HasColumnName("Base");
            this.Property(t => t.StartingMaterialMW).HasColumnName("StartingMaterialMW").HasPrecision(10, 4);
            this.Property(t => t.VendorName).HasColumnName("VendorName");
            this.Property(t => t.VendorCatalogNumber).HasColumnName("VendorCatalogNumber");
            this.Property(t => t.Coupling).HasColumnName("Coupling");
            this.Property(t => t.Deprotection).HasColumnName("Deprotection");
            this.Property(t => t.IncorporatedMW).HasColumnName("IncorporatedMW").HasPrecision(10, 4);
            this.Property(t => t.Formula).HasColumnName("Formula");
            this.Property(t => t.DisplayColor).HasColumnName("DisplayColor");
            this.Property(t => t.Notes).HasColumnName("Notes");
        }
    }
}
