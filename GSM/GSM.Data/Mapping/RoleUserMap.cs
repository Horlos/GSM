using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class RoleUserMap : EntityTypeConfiguration<RoleUser>
    {
        public RoleUserMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties

            // Table & Column Mappings
            this.ToTable("RoleUser");
            this.Property(t => t.Id).HasColumnName("RoleUserID");
            this.Property(t => t.UserId).HasColumnName("UserID");
            this.Property(t => t.RoleId).HasColumnName("RoleID");

            // Relationships
            this.HasRequired(t => t.Role)
                .WithMany(t => t.RoleUsers)
                .HasForeignKey(d => d.RoleId);

            this.HasRequired(t => t.User)
                .WithMany(t => t.Roles)
                .HasForeignKey(d => d.UserId);
        }
    }
}
