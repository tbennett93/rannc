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
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<CategoriesController> _iLogger;

        public CategoriesController(ICategoriesRepository categoriesRepository, 
            IMapper mapper, 
            ILogger<CategoriesController> iLogger
            )
        {
            this._categoriesRepository = categoriesRepository;
            this._mapper = mapper;
            this._iLogger = iLogger ?? throw new ArgumentNullException(nameof(iLogger));

        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<CategoryViewModel>> GetCategories()
        {
            _iLogger.LogInformation("Categories.Get initiated");
            var claimsIdentity = this.User.GetUserId();

            if (claimsIdentity == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }
           
            var userCategories = await _categoriesRepository.GetCategories((long)claimsIdentity);
            var model = _mapper.Map<List<CategoryViewModel>>(userCategories);

            _iLogger.LogInformation("Categories for user found");
            return Ok(model);
        }        
 
    }
}
