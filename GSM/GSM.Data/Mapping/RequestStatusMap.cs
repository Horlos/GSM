using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class RequestStatusMap : EntityTypeConfiguration<RequestStatus>
    {
        public RequestStatusMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.Description)
                .IsRequired()
                .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("Status");
            this.Property(t => t.Id).HasColumnName("StatusID");
            this.Property(t => t.Description).HasColumnName("Description");
        }
    }
}
