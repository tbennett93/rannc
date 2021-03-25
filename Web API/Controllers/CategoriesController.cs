using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features.Authentication;
using Rannc.Data;
using Rannc.Models;
using Rannc.Services;


namespace Rannc.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoriesRepository _categoriesRepository;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;
        private readonly IUserRepository _userRepository;
        public CategoriesController(ICategoriesRepository categoriesRepository, 
            IMapper mapper, 
            ITokenService tokenService,
            IUserRepository userRepository)
        {
            this._categoriesRepository = categoriesRepository;
            this._mapper = mapper;
            this._tokenService = tokenService;
            this._userRepository = userRepository;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<CategoryViewModel>> GetCategories()
        {

            var claimsIdentity = this.User.GetUserID();
            var userCategories = await _categoriesRepository.GetCategories(claimsIdentity);
            var model = _mapper.Map<List<CategoryViewModel>>(userCategories);
            return Ok(model);
        }        
 
    }
}
