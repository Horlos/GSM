using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class ModStructureTypeMap : EntityTypeConfiguration<ModStructureType>
    {
        public ModStructureTypeMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("ModStructureType");
            this.Property(t => t.Id).HasColumnName("ModStructureTypeID");
            this.Property(t => t.Name).HasColumnName("Name");
        }
    }
}
