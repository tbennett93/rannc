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

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> PostCategory([FromBody] CategoryViewModel categoryViewModel)
        {
            _iLogger.LogInformation("Categories.PostCategory initiated");

            var userId = this.User.GetUserId();

            if (userId== null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            var userCategory = _mapper.Map<CategoryModel>(categoryViewModel);

            userCategory.LoginModelId = (long)userId;

            if (userCategory == null)
            {
                _iLogger.LogWarning("Unable to create CategoryViewModel from {0]", categoryViewModel);
                return BadRequest("Unable to parse data");
            }


            var postResponse = await _categoriesRepository.PostCategory(userCategory, (long)userId);

            if (postResponse == null)
            {
                _iLogger.LogWarning("Error when posting");
                return BadRequest("Unable to add item");
            }

            _iLogger.LogInformation("Post successful");

            return Ok(_mapper.Map<CategoryViewModel>(postResponse));




        }

        [HttpGet, Route("categoryitems")]
        [Authorize]
        public async Task<ActionResult<CategoryGroupsViewModel>> GetCategoryItems([FromHeader] int categoryId)
        {
            _iLogger.LogInformation("Category.Get initiated");
            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }
         
            var userCategoryItems = await _categoriesRepository.GetCategoryItems(categoryId, (long)userId);
            
            //var model = _mapper.Map<List<CategoryItemsViewModel>>(userCategoryItems);
            var userCategoryItemsView = _mapper.Map<List<CategoryGroupsViewModel>>(userCategoryItems);

            _iLogger.LogInformation("Categories for user found");
            return Ok(userCategoryItemsView);
        }



        [HttpPost, Route("categorygroup")]
        [Authorize]
        public async Task<ActionResult> PostCategoryGroup([FromBody] CategoryGroupPostedModel postedItem)
        {
            _iLogger.LogInformation("Called Categories.PostCategoryGroup");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            CategoryGroupsModel categoryGroupsModel = new CategoryGroupsModel()
            {
                Name = postedItem.Name,
                Order = Convert.ToInt64(postedItem.Order),
                CategoryModelId = Convert.ToInt64(postedItem.CategoryId)
            };



            if (categoryGroupsModel == null)
            {
                _iLogger.LogWarning("Unable to create CategoryItemsModel from {0]", postedItem);
                return BadRequest("Unable to parse data");
            }


            var postResponse = await _categoriesRepository.PostCategoryGroup(categoryGroupsModel, (long)userId, Convert.ToInt64(postedItem.CategoryId));

            if (postResponse == null)
            {
                _iLogger.LogWarning("Error when posting");
                return BadRequest("Unable to add item");
            }

            _iLogger.LogInformation("Post successful");

            return Ok(postResponse);

        }

        [HttpDelete, Route("categorygroup")]
        [Authorize]
        public async Task<ActionResult> DeleteCategoryGroup([FromHeader] string categoryGroupId, [FromHeader] string categoryModelId)
        {
            _iLogger.LogInformation("Categories.DeleteCategoryGroup called");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            if (string.IsNullOrEmpty(categoryGroupId))
            {
                _iLogger.LogWarning("Invalid Group Id specified on JSON - {0}", categoryGroupId);
                return BadRequest("Incomplete request");
            }            

            if (string.IsNullOrEmpty(categoryModelId))
            {
                _iLogger.LogWarning("Invalid Category Id specified on JSON - {0}", categoryModelId);
                return BadRequest("Incomplete request");
            }


            if (!await _categoriesRepository.DeleteCategoryGroupAsync(Convert.ToInt64(categoryGroupId), (long)userId, Convert.ToInt64(categoryModelId)))
            {
                _iLogger.LogWarning("Unable to delete item with group id {0} and category id {1}", categoryGroupId, categoryModelId);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogInformation("Item successfully deleted with group id {0} and category id {1}", categoryGroupId, categoryModelId);

            return Ok();
        }



        [HttpPost, Route("categoryitem")]
        [Authorize]
        public async Task<ActionResult> PostCategoryItem([FromBody] CategoryItemPostedModel postedItem)
        {
            _iLogger.LogInformation("Called Categories.PostCategory");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            


            var userCategoryItem = _mapper.Map<CategoryItemsModel>(postedItem);
 
            if (userCategoryItem == null)
            {
                _iLogger.LogWarning("Unable to create CategoryItemsModel from {0]", postedItem);
                return BadRequest("Unable to parse data");
            }


            var postResponse = await _categoriesRepository.PostCategoryItem(userCategoryItem, (long)userId, Convert.ToInt64(postedItem.CategoryModelId));

            if (postResponse == null)
            {
                _iLogger.LogWarning("Error when posting");
                return BadRequest("Unable to add item");
            }

            _iLogger.LogInformation("Post successful");

            return Ok(_mapper.Map<CategoryItemsViewModel>(postResponse));

        }

        [HttpDelete, Route("categoryitem")]
        [Authorize]
        public async Task<ActionResult> DeleteCategoryItem([FromHeader] string id)
        {
            _iLogger.LogInformation("Categories.DeleteCategoryItem called");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            if (string.IsNullOrEmpty(id))
            {
                _iLogger.LogWarning("Invalid id specified on JSON - {0}", id);
                return BadRequest("Incomplete request");
            }
            

            if (!await _categoriesRepository.DeleteCategoryItemAsync(Convert.ToInt64(id), (long)userId))
            {
                _iLogger.LogWarning("Unable to delete item with id {0} ", id);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogInformation("Item successfully deleted. Id: {0} ", id);
            return Ok();
        }

    }
}
