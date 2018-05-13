using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class OrientationMap : EntityTypeConfiguration<Orientation>
    {
        public OrientationMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("Orientation");
            this.Property(t => t.Id).HasColumnName("OrientationID");
            this.Property(t => t.Name).HasColumnName("Name");
        }
    }
}
