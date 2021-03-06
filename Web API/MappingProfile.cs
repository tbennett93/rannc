using System.Data.Common;
using AutoMapper;
using Rannc.Models;
using Rannc.Models.DTOs;

namespace Rannc
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {

            CreateMap<CategoryModel, CategoryViewModel>()
                .ForMember(dest => dest.Name, o=> o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id));

            CreateMap<CategoryViewModel, CategoryModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id));


            CreateMap<CategoryItemsViewModel, CategoryItemsModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Comment, o => o.MapFrom(src => src.Comment))
                ;


            CreateMap<CategoryGroupsViewModel, CategoryGroupsModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.CategoryItemsModels, o => o.MapFrom(src => src.Items))
                ;


            CreateMap<CategoryItemPostedModel, CategoryItemsModel>()
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.CategoryGroupsId, o => o.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Comment, o => o.MapFrom(src => src.Comment))
                ;
            CreateMap<CategoryGroupPutModel, CategoryGroupPutModelMapped>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.CategoryId, o => o.MapFrom(src => src.CategoryId))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id));


            CreateMap<CategoryModel, CategoryGroupItemsViewModel>()
                .ForMember(dest => dest.CategoryName, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.CategoryId, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Groups, o => o.MapFrom(src => src.CategoryGroupsModels));

            CreateMap<CategoryGroupsModel, CategoryGroupsViewModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Items, o => o.MapFrom(src => src.CategoryItemsModels));

            CreateMap<CategoryItemsModel, CategoryItemsViewModel>()
                .ForMember(dest => dest.Name, o => o.MapFrom(src => src.Name))
                .ForMember(dest => dest.Comment, o => o.MapFrom(src => src.Comment))
                .ForMember(dest => dest.Order, o => o.MapFrom(src => src.Order))
                .ForMember(dest => dest.Id, o => o.MapFrom(src => src.Id));
        }

    }
}