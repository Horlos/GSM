using System.Data.Entity.ModelConfiguration;

namespace GSM.Data.Models.Mapping
{
    public class MaterialRequestMap : EntityTypeConfiguration<MaterialRequest>
    {
        public MaterialRequestMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            // Table & Column Mappings
            this.ToTable("MaterialRequest");
            this.Property(t => t.Id).HasColumnName("MaterialRequestID");
            this.Property(t => t.RequestDate).HasColumnName("RequestDate");
            this.Property(t => t.NeedByDate).HasColumnName("NeedByDate");
            this.Property(t => t.StatusId).HasColumnName("StatusID");
            this.Property(t => t.SubmittedBy).HasColumnName("SubmittedBy");
            this.Property(t => t.Notes).HasColumnName("Notes");
            this.Property(t => t.SetDetail).HasColumnName("SetDetail");

            // Relationships
            this.HasMany(t => t.RequestedStrands)
                .WithRequired(t => t.MaterialRequest);

            //Add relationship for duplex
            this.HasMany(t => t.RequestedDuplexes)
                .WithRequired(t => t.MaterialRequest);

            this.HasMany(t => t.SynthesisRequests)
               .WithMany(t => t.MaterialRequests)
               .Map(m =>
               {
                   m.ToTable("SythesisRequestMaterialRequest");
                   m.MapLeftKey("MaterialRequestID");
                   m.MapRightKey("SynthesisRequestID");
               });

            this.HasRequired(t => t.Status)
                .WithMany(t => t.MaterialRequests)
                .HasForeignKey(d => d.StatusId);
            this.HasRequired(t => t.User)
                .WithMany(t => t.MaterialRequests)
                .HasForeignKey(d => d.SubmittedBy);
        }
    }
}
