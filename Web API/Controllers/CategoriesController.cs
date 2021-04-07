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

        [HttpGet, Route("category")]
        [Authorize]
        public async Task<ActionResult<CategoryItemsViewModel>> GetCategory([FromHeader] int categoryId)
        {
            _iLogger.LogInformation("Category.Get initiated");
            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }
            //var userId = this.User.GetUserId();

            //if (userId == null)
            //{
            //    _iLogger.LogWarning("Claim identity could not be found");
            //    return BadRequest("Bad request");
            //}

            //var userCategoryItems = await _categoriesRepository.GetCategoryItems((long)userId, categoryId);
            var userCategoryItems = await _categoriesRepository.GetCategoryItems(categoryId, (long)userId);
            var model = _mapper.Map<List<CategoryItemsViewModel>>(userCategoryItems);

            _iLogger.LogInformation("Categories for user found");
            return Ok(model);
        }


        [HttpPost, Route("category")]
        [Authorize]
        public async Task<ActionResult> PostCategory([FromBody] CategoryItemsViewModel categoryItemsViewModel)
        {
            _iLogger.LogInformation("Called Categories.PostCategory");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            


            var userCategoryItem = _mapper.Map<CategoryItemsModel>(categoryItemsViewModel);
            //var userCategoryItem = new CategoryItemsModel()
            //{
            //    //CategoryModelId = categoryItemsViewModel.CategoryModelId,
            //    Name = categoryItemsViewModel.Name,
            //    Group = categoryItemsViewModel.Group,
            //    Order = categoryItemsViewModel.Order,
            //    Comment = categoryItemsViewModel.Comment
            //};

            if (userCategoryItem == null)
            {
                _iLogger.LogWarning("Unable to create CategoryItemsModel from {0]", categoryItemsViewModel);
                return BadRequest("Unable to parse data");
            }


            var postResponse = await _categoriesRepository.PostCategoryItem(userCategoryItem, (long)userId);

            if (postResponse == null)
            {
                _iLogger.LogWarning("Error when posting");
                return BadRequest("Unable to add item");
            }

            _iLogger.LogInformation("Post successful");

            return Ok(_mapper.Map<CategoryItemsViewModel>(postResponse));

        }

        [HttpDelete, Route("category")]
        [Authorize]
        public async Task<ActionResult> DeleteCategoryItem([FromHeader] string id, [FromHeader] string type)
        {
            _iLogger.LogInformation("Categories.DeleteCategoryItem called");
            if (string.IsNullOrEmpty(type) ||
                string.IsNullOrEmpty(id))
            {
                _iLogger.LogWarning("Invalid Type specified on JSON - {0} or {1}", id, type);
                return BadRequest("Incomplete request");
            }

            if (!type.Equals("CategoryItem") )
            {
                _iLogger.LogWarning("Invalid Type specified on JSON - {0}", type); 
                return BadRequest("Invalid request");
            }



            if (!await _categoriesRepository.DeleteCategoryItemAsync(Convert.ToInt64(id)))
            {
                _iLogger.LogWarning("Unable to delete item with id {0} ", id);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogWarning("Item successfully deleted. Id: {0} ", id);
            return Ok();
        }

    }
}
