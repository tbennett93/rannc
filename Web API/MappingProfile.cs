using AutoMapper;
using Rannc.Models;

namespace Rannc
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<CategoryModel, CategoryViewModel>()
                .ForMember(dest => dest.Name, o=> o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id));

            CreateMap<CategoryItemsModel, CategoryItemsViewModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Group, o => o.MapFrom(src => src.Group))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Comment, o => o.MapFrom(src => src.Comment))
                .ForMember(dest => dest.CategoryModelId, o => o.MapFrom(src => src.CategoryModelId))
                ;
            CreateMap<CategoryItemsViewModel, CategoryItemsModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Group, o => o.MapFrom(src => src.Group))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Comment, o => o.MapFrom(src => src.Comment))
                .ForMember(dest => dest.CategoryModelId, o => o.MapFrom(src => src.CategoryModelId))
                ;
        }
        
    }
}