using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features.Authentication;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesRepository categoriesRepository;
        private readonly IMapper mapper;
        public CategoriesController(ICategoriesRepository categoriesRepository, IMapper mapper)
        {
            this.categoriesRepository = categoriesRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<CategoryViewModel>> GetCategories([FromHeader] long userId)
        {
            var userCategories = await categoriesRepository.GetCategories(userId);
            var model = mapper.Map<List<CategoryViewModel>>(userCategories);
            return Ok(model);
        }
        
    }
}
