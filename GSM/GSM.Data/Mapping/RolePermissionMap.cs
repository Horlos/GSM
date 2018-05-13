using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class RolePermissionMap: EntityTypeConfiguration<RolePermission>
    {
        public RolePermissionMap()
        {
            // Primary Key
            this.HasKey(t => new { t.RoleId, t.PermissionId});

            // Properties
            this.Property(t => t.PermissionId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            this.Property(t => t.RoleId)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.None);

            // Table & Column Mappings
            this.ToTable("RolePermissions");
            this.Property(t => t.PermissionId).HasColumnName("PermissionID");
            this.Property(t => t.RoleId).HasColumnName("RoleID");

            // Relationships
            this.HasRequired(t => t.Permission)
                .WithMany()
                .HasForeignKey(d => d.PermissionId);

            this.HasRequired(t => t.Role)
                .WithMany(t => t.Permissions)
                .HasForeignKey(d => d.RoleId);
        }
    }
}
