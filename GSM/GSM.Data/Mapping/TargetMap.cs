using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class TargetMap : EntityTypeConfiguration<Target>
    {
        public TargetMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("Target");
            this.Property(t => t.Id).HasColumnName("TargetID");
            this.Property(t => t.Name).HasColumnName("Name");
            this.Property(t => t.IsActive).HasColumnName("IsActive");
        }
    }
}
