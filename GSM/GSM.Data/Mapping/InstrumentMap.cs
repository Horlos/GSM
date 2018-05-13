using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class InstrumentMap : EntityTypeConfiguration<Instrument>
    {
        public InstrumentMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Name)
                .IsRequired()
                .HasMaxLength(255);

            // Table & Column Mappings
            this.ToTable("Instrument");
            this.Property(t => t.Id).HasColumnName("InstrumentID");
            this.Property(t => t.Name).HasColumnName("Name");
            this.Property(t => t.IsActive).HasColumnName("IsActive");
            this.Property(t => t.MaxAmidites).HasColumnName("MaxAmidites");
        }
    }
}
