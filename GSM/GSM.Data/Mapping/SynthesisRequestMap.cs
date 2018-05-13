using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class SynthesisRequestMap : EntityTypeConfiguration<SynthesisRequest>
    {
       public SynthesisRequestMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.RequestedBy)
                .HasMaxLength(255);

            this.Property(t => t.SetDetail)
                .HasMaxLength(50);

            // Table & Column Mappings
            this.ToTable("SynthesisRequest");
            this.Property(t => t.Id).HasColumnName("SynthesisRequestID");
            this.Property(t => t.StatusId).HasColumnName("SynthesisStatusID");
            this.Property(t => t.RequestDate).HasColumnName("RequestDate");
            this.Property(t => t.RequestedBy).HasColumnName("RequestedBy");
            this.Property(t => t.Needed).HasColumnName("Needed");
            this.Property(t => t.DateCompleted).HasColumnName("DateCompleted");
            this.Property(t => t.Notes).HasColumnName("Notes");
            this.Property(t => t.SetDetail).HasColumnName("SetDetail");

            //Add relationship for Status
            this.HasRequired(t => t.Status)
              .WithMany(t => t.SynthesisRequests)
              .HasForeignKey(d => d.StatusId);
        }
    }
}
