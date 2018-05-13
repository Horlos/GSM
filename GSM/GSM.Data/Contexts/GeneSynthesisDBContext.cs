using System.Data.Entity;
using GSM.Data.Common;
using GSM.Data.Mapping;
using GSM.Data.Models.Mapping;

namespace GSM.Data.Models
{
    public partial class GeneSythesisDBContext : DbContext, ITestableGeneSythesisDBContext
    {
        static GeneSythesisDBContext()
        {
            Database.SetInitializer<GeneSythesisDBContext>(null);
        }

        public GeneSythesisDBContext()
            : base("Name=GeneSynthesisDBContext")
        {
        }

        public virtual DbSet<Duplex> Duplexes { get; set; }
        public virtual DbSet<DuplexBatch> DuplexBatches { get; set; }
        public virtual DbSet<Instrument> Instruments { get; set; }
        public virtual DbSet<InstrumentModStructure> InstrumentModStructures { get; set; }
        public virtual DbSet<MaterialRequest> MaterialRequests { get; set; }
        public virtual DbSet<DuplexMaterialRequest> DuplexMaterialRequests { get; set; }
        public virtual DbSet<ModifierTemplate> ModifierTemplates { get; set; }
        public virtual DbSet<ModifierTemplatePosition> ModifierTemplatePositions { get; set; }
        public virtual DbSet<ModStructure> ModStructures { get; set; }
        public virtual DbSet<ModStructureAttachment> ModStructureAttachments { get; set; }
        public virtual DbSet<ModStructureType> ModStructureTypes { get; set; }
        public virtual DbSet<Orientation> Orientations { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }
        public virtual DbSet<RoleUser> RoleUsers { get; set; }
        public virtual DbSet<RolePermission> RolePermissions { get; set; }
        public virtual DbSet<Species> SpeciesList { get; set; }
        public virtual DbSet<RequestStatus> Status { get; set; }
        public virtual DbSet<Strand> Strands { get; set; }
        public virtual DbSet<StrandModStructure> StrandModStructures { get; set; }
        public virtual DbSet<StrandBatch> StrandBatches { get; set; }
        public virtual DbSet<SynthesisRequest> SynthesisRequests { get; set; }
        public virtual DbSet<Target> Targets { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<StrandSynthesisRequest> SynthesisRequestStrands { get; set; }
        public virtual DbSet<DuplexBatchStrandBatch> DuplexBatchStrandBatches { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new DuplexMap());
            modelBuilder.Configurations.Add(new DuplexBatchMap());
            modelBuilder.Configurations.Add(new InstrumentMap());
            modelBuilder.Configurations.Add(new InstrumentModStructureMap());
            modelBuilder.Configurations.Add(new MaterialRequestMap());
            modelBuilder.Configurations.Add(new StrandMaterialRequestMap());
            modelBuilder.Configurations.Add(new DuplexMaterialRequestMap());
            modelBuilder.Configurations.Add(new ModifierTemplateMap());
            modelBuilder.Configurations.Add(new ModifierTemplatePositionMap());
            modelBuilder.Configurations.Add(new ModStructureMap());
            modelBuilder.Configurations.Add(new ModStructureAttachmentMap());
            modelBuilder.Configurations.Add(new ModStructureTypeMap());
            modelBuilder.Configurations.Add(new OrientationMap());
            modelBuilder.Configurations.Add(new RoleMap());
            modelBuilder.Configurations.Add(new UserMap());
            modelBuilder.Configurations.Add(new RoleUserMap());
            modelBuilder.Configurations.Add(new PermissionMap());
            modelBuilder.Configurations.Add(new RolePermissionMap());
            modelBuilder.Configurations.Add(new SpeciesMap());
            modelBuilder.Configurations.Add(new StrandMap());
            modelBuilder.Configurations.Add(new StrandModStructureMap());
            modelBuilder.Configurations.Add(new StrandBatchMap());
            modelBuilder.Configurations.Add(new SynthesisRequestMap());
            modelBuilder.Configurations.Add(new TargetMap());
            modelBuilder.Configurations.Add(new RequestStatusMap());
            modelBuilder.Configurations.Add(new SynthesisRequestStrandMap());
            modelBuilder.Configurations.Add(new DuplexBatchStrandBatchMap());
        }

        public virtual void SetEntityStateAdded<TEntity>(TEntity item) where TEntity : class, IEntity
        {
            Entry(item).State = EntityState.Added;
        }

        public virtual void SetEntityStateModified<TEntity>(TEntity item) where TEntity: class, IEntity
        {
            Entry(item).State = EntityState.Modified;
        }

        public virtual void SetEntityStateDeleted<TEntity>(TEntity item) where TEntity : class, IEntity
        {
            Entry(item).State = EntityState.Deleted;
        }

        public virtual int ExecuteSqlCommand(string sql, params object[] parameters)
        {
            return this.Database.ExecuteSqlCommand(sql, parameters);
        }
    }

    public interface ITestableGeneSythesisDBContext
    {
        int SaveChanges();

        void SetEntityStateAdded<TEntity>(TEntity item) where TEntity : class, IEntity;

        void SetEntityStateModified<TEntity>(TEntity item) where TEntity : class, IEntity;

        void SetEntityStateDeleted<TEntity>(TEntity item) where TEntity : class, IEntity;

        int ExecuteSqlCommand(string sql, params object[] parameters);
    }
}
