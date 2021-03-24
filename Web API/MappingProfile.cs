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
        }
        
    }
}