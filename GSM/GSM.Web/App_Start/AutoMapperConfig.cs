using System;
using System.Globalization;
using System.Linq;
using AutoMapper;
using GSM.API.Models;
using GSM.API.Models.Duplex;
using GSM.API.Models.Instruments;
using GSM.API.Models.MaterialRequest;
using GSM.API.Models.ModifierTemplates;
using GSM.API.Models.ModStructures;
using GSM.API.Models.Orientations;
using GSM.API.Models.SynthesisRequest;
using GSM.Data.DTOs;
using GSM.Data.Models;

namespace GSM
{
    public class AutoMapperConfig
    {
        //private static MapperConfiguration _mapperConfiguration;
        //private static IMapper _mapper;

        //public static MapperConfiguration MapperConfiguration
        //{
        //    get
        //    {
        //        if (_mapperConfiguration == null)
        //            RegisterMappings();

        //        return _mapperConfiguration;
        //    }
        //}

        //public static IMapper Mapper
        //{
        //    get
        //    {
        //        if (_mapper == null)
        //            _mapper = MapperConfiguration.CreateMapper();

        //        return _mapper;
        //    }
        //}

        public static void RegisterMappings()
        {
            Action<IMapperConfigurationExpression> configure = cfg =>
            {
                MapModelsToViewModels(cfg);
                MapViewModelsToModels(cfg);
            };
            Mapper.Initialize(configure);
            //_mapperConfiguration = new MapperConfiguration(configure);
        }


        private static void MapModelsToViewModels(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<Duplex, DuplexViewModel>();
            cfg.CreateMap<DuplexBatch, DuplexBatchInfoViewModel>();
            cfg.CreateMap<Duplex, DuplexModel>();
            cfg.CreateMap<DuplexBatch, DuplexBatchModel>()
                .ForMember(d => d.StrandBatches, opt => opt.MapFrom(s => s.DuplexBatchStrandBatches));
            cfg.CreateMap<DuplexBatch, DuplexBatchViewModel>()
                .ForMember(d => d.StrandBatches, opt => opt.MapFrom(s => s.DuplexBatchStrandBatches))
                .ForMember(d => d.DuplexId, opt => opt.MapFrom(s => s.Duplex.DuplexId))
                .ForMember(d => d.Target,
                    opt => opt.MapFrom(s => s.DuplexBatchStrandBatches.FirstOrDefault().StrandBatch.Strand.Target));
            cfg.CreateMap<DuplexBatchStrandBatch, DuplexStrandBatchViewModel>();
            cfg.CreateMap<DuplexBatchDenormalizedModel, DuplexBatchDenormalizedViewModel>();

            cfg.CreateMap<Strand, StrandViewModel>();
            cfg.CreateMap<Strand, StrandModel>();
            cfg.CreateMap<StrandBatch, StrandBatchViewModel>()
                .ForMember(d => d.Orientation, opt => opt.MapFrom(s => s.Strand.Orientation));
            cfg.CreateMap<StrandBatch, StrandBatchModel>();

            cfg.CreateMap<StrandModStructure, StrandModStructureViewModel>();
            cfg.CreateMap<ModStructure, ModStructureModel>()
               .ForMember(d => d.Attachments, opt => opt.MapFrom(src => src.ModStructureAttachments));
            cfg.CreateMap<ModStructure, ModStructureViewModel>();
            cfg.CreateMap<InstrumentModStructure, InstrumentModStructureViewModel>();
            cfg.CreateMap<ModStructureAttachment, AttachmentInfo>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id));

            cfg.CreateMap<Species, SpeciesModel>();
            cfg.CreateMap<Species, SpeciesViewModel>();

            //target mapp
            cfg.CreateMap<Target, TargetViewModel>();
            cfg.CreateMap<Target, TargetModel>();

            //orientation mapp
            cfg.CreateMap<Orientation, OrientationViewModel>();
            cfg.CreateMap<Orientation, OrientationModel>();
            cfg.CreateMap<Instrument, InstrumentModel>();
            cfg.CreateMap<Instrument, InstrumentViewModel>();

            cfg.CreateMap<ModifierTemplate, ModifierTemplateViewModel>();
            cfg.CreateMap<ModifierTemplate, ModifierTemplateModel>();

            //status map
            cfg.CreateMap<RequestStatus, StatusViewModel>();

            cfg.CreateMap<Role, RoleViewModel>()
                .ForMember(d => d.Users, opt => opt.MapFrom(s => s.RoleUsers));
            cfg.CreateMap<Permission, PermissionViewModel>();
            cfg.CreateMap<RolePermission, RolePermissionViewModel>();
            cfg.CreateMap<RoleUser, RoleUserViewModel>();
            cfg.CreateMap<User, UserViewModel>();

            cfg.CreateMap<StrandSynthesisRequest, StrandSynthesisRequestViewModel>()
                .ForMember(d => d.Scale,
                    opt =>
                        opt.MapFrom(
                            s => string.Format(CultureInfo.InvariantCulture, "{0:0} {1:0}", s.Scale, s.ScaleUnit)));

            cfg.CreateMap<SynthesisRequest, SynthesisRequestModel>();
            cfg.CreateMap<SynthesisRequest, SynthesisRequestViewModel>();
            cfg.CreateMap<SynthesisRequestDenormalizedModel, SynthesisRequestDenormalizedViewModel>();

            //.ForMember(dest => dest.RequestDate,
            //    opt =>
            //        opt.MapFrom(
            //            src =>
            //                (src.RequestDate.HasValue
            //                    ? new DateTime(src.RequestDate.Value.Year, src.RequestDate.Value.Month,
            //                        src.RequestDate.Value.Day, 12, 0, 0)
            //                    : (DateTime?)null)))
            //.ForMember(dest => dest.Needed,
            //    opt =>
            //        opt.MapFrom(
            //            src =>
            //                (src.Needed.HasValue
            //                    ? new DateTime(src.Needed.Value.Year, src.Needed.Value.Month, src.Needed.Value.Day,
            //                        12, 0, 0)
            //                    : (DateTime?)null))
            //);

            //To map DAO MaterialRequest to MaterialRequest DTO 
            cfg.CreateMap<StrandMaterialRequest, StrandMaterialRequestViewModel>();
            cfg.CreateMap<DuplexMaterialRequest, DuplexMaterialRequestViewModel>();
            cfg.CreateMap<MaterialRequest, MaterialRequestModel>();
            cfg.CreateMap<MaterialRequest, MaterialRequestViewModel>();
            cfg.CreateMap<MaterialRequestDenormalizedModel, MaterialRequestDenormalizedViewModel>();
            //.ForMember(
            //    dest => dest.RequestDate,
            //    opt => opt.MapFrom(src =>
            //                new DateTime(src.RequestDate.Year, src.RequestDate.Month, src.RequestDate.Day, 12, 0, 0)
            //    )
            //)
            //.ForMember(
            //    dest => dest.NeedByDate,
            //    opt => opt.MapFrom(src =>
            //            (src.NeedByDate.HasValue
            //                ? new DateTime(src.NeedByDate.Value.Year, src.NeedByDate.Value.Month,
            //                    src.NeedByDate.Value.Day, 12, 0, 0)
            //                : (DateTime?)null)
            //    )
            //);
        }

        private static void MapViewModelsToModels(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<DuplexBatchModel, DuplexBatch>()
                .ForMember(d => d.DuplexBatchNumber, opt => opt.Ignore())
                .ForMember(d => d.DuplexBatchStrandBatches, opt => opt.MapFrom(s => s.StrandBatches))
                .ForMember(d => d.Duplex, opt => opt.Ignore());
            cfg.CreateMap<DuplexViewModel, Duplex>();
            cfg.CreateMap<DuplexModel, Duplex>()
                 .ForMember(d => d.DuplexId, opt => opt.Ignore());
            cfg.CreateMap<DuplexStrandBatchViewModel, DuplexBatchStrandBatch>()
                .ForMember(d => d.StrandBatch, opt => opt.Ignore());

            cfg.CreateMap<StrandModel, Strand>()
                .ForMember(d => d.Id, opt => opt.Ignore())
                .ForMember(d => d.StrandId, opt => opt.Ignore())
                .ForMember(d => d.Sequence, opt => opt.Ignore())
                .ForMember(d => d.BaseSequence, opt => opt.Ignore())
                .ForMember(d => d.TargetId, opt => opt.MapFrom(s => s.Target != null ? s.Target.Id : 0))
                .ForMember(d => d.OrientationId, opt => opt.MapFrom(s => s.Orientation != null ? s.Orientation.Id : 0))
                .ForMember(d => d.Batches, opt => opt.Ignore());
            cfg.CreateMap<StrandBatchModel, StrandBatch>()
                .ForMember(d => d.BatchNumber, opt => opt.Ignore())
                .ForMember(d => d.Strand, opt => opt.Ignore());
            cfg.CreateMap<StrandBatchViewModel, StrandBatch>()
                .ForMember(d => d.AmountRemaining, opt => opt.Ignore());
            cfg.CreateMap<StrandViewModel, Strand>();

            cfg.CreateMap<StrandModStructureViewModel, StrandModStructure>()
                .ForMember(d => d.ModStructureId,
                    opt => opt.MapFrom(s => s.ModStructure != null ? s.ModStructure.Id : s.ModStructureId));
            cfg.CreateMap<ModStructureViewModel, ModStructure>()
                .ForMember(d => d.InstrumentModStructures, opt => opt.Ignore());
            cfg.CreateMap<ModStructureModel, ModStructure>()
                .ForMember(d => d.ModStructureAttachments, opt => opt.Ignore());
            cfg.CreateMap<AttachmentInfo, ModStructureAttachment>()
                .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id));

            cfg.CreateMap<TargetViewModel, Target>();
            cfg.CreateMap<TargetModel, Target>();
            cfg.CreateMap<TargetViewModel, Target>();

            cfg.CreateMap<SpeciesModel, Species>();
            cfg.CreateMap<SpeciesViewModel, Species>();

            cfg.CreateMap<RoleViewModel, Role>()
                .ForMember(d => d.RoleUsers, opt => opt.MapFrom(s => s.Users));
            cfg.CreateMap<PermissionViewModel, Permission>();
            cfg.CreateMap<RolePermissionViewModel, RolePermission>();
            cfg.CreateMap<RoleUserViewModel, RoleUser>();
            cfg.CreateMap<UserViewModel, User>();

            cfg.CreateMap<OrientationViewModel, Orientation>();
            cfg.CreateMap<InstrumentModel, Instrument>();
            cfg.CreateMap<InstrumentViewModel, Instrument>();
            cfg.CreateMap<StatusViewModel, RequestStatus>();

            cfg.CreateMap<ModifierTemplateModel, ModifierTemplate>();
            cfg.CreateMap<ModifierTemplateViewModel, ModifierTemplate>();

            cfg.CreateMap<StrandSynthesisRequestViewModel, StrandSynthesisRequest>()
                .ForMember(d => d.Strand, opt => opt.Ignore());
            cfg.CreateMap<SynthesisRequestModel, SynthesisRequest>()
                .ForMember(d => d.StatusId, o => o.Ignore())
                .ForMember(d => d.Status, o => o.Ignore())
                .ForMember(d => d.RequestDate, o => o.Ignore());

            //To map MaterialRequest DTO to MaterialRequest DAO
            //the null values don't overwrite existing ones
            cfg.CreateMap<StrandMaterialRequestViewModel, StrandMaterialRequest>()
                .ForMember(d => d.Strand, opt => opt.Ignore());

            cfg.CreateMap<DuplexMaterialRequestViewModel, DuplexMaterialRequest>()
                .ForMember(d => d.Duplex, opt => opt.Ignore());

            cfg.CreateMap<MaterialRequestModel, MaterialRequest>()
                .ForMember(d => d.Status, o => o.Ignore())
                .ForMember(d => d.StatusId, o => o.Ignore())
                .ForMember(d => d.SubmittedBy, o => o.Ignore())
                .ForMember(d => d.User, o => o.Ignore())
                .ForMember(d => d.RequestDate, o => o.Ignore());
        }
    }
}