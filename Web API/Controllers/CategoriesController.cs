using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.Internal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Rannc.Data;
using Rannc.Models;
using Rannc.Models.DTOs;
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

        public CategoriesController(
            ICategoriesRepository categoriesRepository,
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

            var userCategories = await _categoriesRepository.GetCategories((long) claimsIdentity);
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

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            var userCategory = _mapper.Map<CategoryModel>(categoryViewModel);

            userCategory.LoginModelId = (long) userId;

            if (userCategory == null)
            {
                _iLogger.LogWarning("Unable to create CategoryViewModel from {0]", categoryViewModel);
                return BadRequest("Unable to parse data");
            }


            var postResponse = await _categoriesRepository.PostCategory(userCategory, (long) userId);

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
        //public async Task<ActionResult<CategoryGroupsViewModel>> GetCategoryItems([FromHeader] int categoryId)
        public async Task<ActionResult<LoginModel>> GetCategoryItems([FromHeader] int categoryId)
        {
            _iLogger.LogInformation("Category.Get initiated");


            if (this.User.GetUserId() == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }


            var userModel = await _categoriesRepository.GetCategoryItems(categoryId);



            if (userModel!= null && 
                userModel.Id != this.User.GetUserId() &&
                userModel.UserName != "TemplateOwnerUser")
            {
                _iLogger.LogWarning("Unauthorised");
                return StatusCode(403);
            }

            var userCategoryItems = userModel.CategoryModels.First();


            var userCategoryItemsView = _mapper.Map<CategoryGroupItemsViewModel>(userCategoryItems);

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


            var postResponse = await _categoriesRepository.PostCategoryGroup(categoryGroupsModel, (long) userId,
                Convert.ToInt64(postedItem.CategoryId));

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
        public async Task<ActionResult> DeleteCategoryGroup([FromHeader] string categoryGroupId,
            [FromHeader] string categoryModelId)
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


            if (!await _categoriesRepository.DeleteCategoryGroupAsync(Convert.ToInt64(categoryGroupId), (long) userId,
                Convert.ToInt64(categoryModelId)))
            {
                _iLogger.LogWarning("Unable to delete item with group id {0} and category id {1}", categoryGroupId,
                    categoryModelId);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogInformation("Item successfully deleted with group id {0} and category id {1}", categoryGroupId,
                categoryModelId);

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


            var postResponse = await _categoriesRepository.PostCategoryItem(userCategoryItem, (long) userId,
                Convert.ToInt64(postedItem.CategoryModelId));

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


            if (!await _categoriesRepository.DeleteCategoryItemAsync(Convert.ToInt64(id), (long) userId))
            {
                _iLogger.LogWarning("Unable to delete item with id {0} ", id);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogInformation("Item successfully deleted. Id: {0} ", id);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> DeleteCategory([FromHeader] string categoryId)
        {
            _iLogger.LogInformation("Categories.DeleteCategory called");

            var userId = this.User.GetUserId();

            if (userId == null)
            {
                _iLogger.LogWarning("Claim identity could not be found");
                return BadRequest("Bad request");
            }

            if (string.IsNullOrEmpty(categoryId))
            {
                _iLogger.LogWarning("Invalid id specified on JSON - {0}", categoryId);
                return BadRequest("Incomplete request");
            }


            if (!await _categoriesRepository.DeleteCategoryAsync(Convert.ToInt64(categoryId), (long) userId))
            {
                _iLogger.LogWarning("Unable to delete item with id {0} ", categoryId);
                return BadRequest("Unable to delete item");
            }

            _iLogger.LogInformation("Item successfully deleted. Id: {0} ", categoryId);
            return Ok();
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> PutCategory([FromBody] List<CategoryGroupPutModel> groupModel)
        {
            _iLogger.LogInformation("Attempting to update category group order");
            var mappedModel = _mapper.Map<List<CategoryGroupPutModelMapped>>(groupModel);

            if (!await _categoriesRepository.UpdateCategoryGroupOrderAsync(mappedModel))
            {
                _iLogger.LogError("Unable to update resources");
                return BadRequest("Unable to update db");
            }

            _iLogger.LogInformation("Order update success");
            return Ok();
        }

        [HttpPut, Route("categorygroup")]
        [Authorize]
        public async Task<ActionResult> PutCategoryGroup([FromBody] List<CategoryGroupsViewModel> groupsModel)
        {
            _iLogger.LogInformation("Attempting to update category items order");

            var groups = _mapper.Map<List<CategoryGroupsModel>>(groupsModel);

            if (!await _categoriesRepository.UpdateCategoryItemsOrderAsync(groups))
            {
                _iLogger.LogError("Unable to update resources");
                return BadRequest("Unable to update db");
            }

            _iLogger.LogInformation("Order update success");
            return Ok();


        }

        [HttpPost, Route("savetemplate")]
        [Authorize]
        public async Task<ActionResult> SaveTemplate([FromHeader] int categoryId)
        {
            _iLogger.LogInformation("Attempting to save category template");


            var templateUser = await _categoriesRepository.GetTemplateUser();

            var category = new CategoryModel();
            
            category = await _categoriesRepository.GetCategoryItemsForClone(categoryId, templateUser.Id);

            category.Id = 0;
            category.CategoryGroupsModels.ForAll(u => u.Id = 0);
            category.CategoryGroupsModels.ForAll(u => u.CategoryItemsModels.ForAll(x => x.Id = 0));

            category.LoginModelId = (long)this.User.GetUserId(); 
            


            if (!await _categoriesRepository.CopyTemplateToUser(category, categoryId))
            {
                _iLogger.LogError("Unable to save template");
                return BadRequest("Unable to update db");
            }

            _iLogger.LogInformation("Template save successful");


            return Ok();

        }


        [HttpGet, Route("top5")]
        [Authorize]
        public async Task<ActionResult> GetTop5()
        {
            _iLogger.LogInformation("Categories.GetTop5 initiated");

            var userCategories = await _categoriesRepository.GetTop5Categories();
            var model = _mapper.Map<List<CategoryViewModel>>(userCategories);

            _iLogger.LogInformation("Top 10 categories found");
            return Ok(model);
        }

        [HttpGet, Route("trending")]
        [Authorize]
        public async Task<ActionResult> GetTrending()
        {
            _iLogger.LogInformation("Categories.GetTrending initiated");

            var userCategories = await _categoriesRepository.GetTrendingCategories();
            var model = _mapper.Map<List<CategoryViewModel>>(userCategories);

            _iLogger.LogInformation("Trending categories found");
            return Ok(model);
        }

        [HttpGet, Route("new")]
        [Authorize]
        public async Task<ActionResult> GetNew()
        {
            _iLogger.LogInformation("Categories.GetNew initiated");

            var user = await _categoriesRepository.GetTemplateUser();
            var userId = user.Id;

            if (userId == null)
            {
                _iLogger.LogWarning("Template user could not be found");
                return BadRequest("Bad request");
            }

            var userCategories = await _categoriesRepository.GetNewCategories(userId);
            var model = _mapper.Map<List<CategoryViewModel>>(userCategories);

            _iLogger.LogInformation("Trending categories found");
            return Ok(model);
        }

    }
}
