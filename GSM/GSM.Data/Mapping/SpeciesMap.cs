using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class SpeciesMap : EntityTypeConfiguration<Species>
    {
        public SpeciesMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("Species");
            this.Property(t => t.Id).HasColumnName("SpeciesID");
            this.Property(t => t.Name).HasColumnName("Name");
            this.Property(t => t.IsActive).HasColumnName("IsActive");

            // Relationships
            this.HasMany(t => t.Strands)
                .WithMany(t => t.Species)
                .Map(m =>
                {
                    m.ToTable("StrandSpecies");
                    m.MapLeftKey("SpeciesID");
                    m.MapRightKey("StrandID");
                });


        }
    }
}
