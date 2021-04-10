using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Rannc.Models;
using Rannc.Services;

namespace Rannc.Data
{
    public class UserSeeder
    {
        private UserContext _userContext;
        private IPasswordHasherService _passwordHasher;
        private ITokenService _iTokenService;
        public UserSeeder(UserContext userContext, IPasswordHasherService passwordHasher, ITokenService iTokenService)
        { 
            this._userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this._passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            this._iTokenService = iTokenService ?? throw new ArgumentNullException(nameof(iTokenService));
        }

        public void Seed()
        {
            var user = _userContext.LoginModel.FirstOrDefault(m => m.UserName == "johndoe");
            var passwordSalt = _passwordHasher.GetSalt();
            if (user == null) {
                user = new LoginModel()
                {
                    UserName = "JohnDoe",
                    Password = _passwordHasher.GetHashedSaltedPassword("JohnDoePassword", passwordSalt),
                    PasswordSalt = passwordSalt,
                    RefreshToken = _iTokenService.GenerateRefreshToken(),
                    RefreshTokenExpiryTime = _iTokenService.RefreshTokenTime
                };
                _userContext.Add(user);
                _userContext.SaveChanges();
            }

            var usercategory = _userContext.Categories
                .Include(u=>u.LoginModel)
                .FirstOrDefault(u=>u.LoginModelId == user.Id);

            if (usercategory == null)
            {
                usercategory = new CategoryModel()
                {
                    Name = "films",
                    LoginModelId = user.Id
                };
                _userContext.Add(usercategory);
                _userContext.SaveChanges();

                var filmsId = usercategory.Id;
                

                var userCategoryGroups = _userContext.CategoryGroups
                    .Include(u => u.CategoryModel)
                    .FirstOrDefault(u => u.CategoryModelId == filmsId);

                long userCategoryGroupsId;

                if (userCategoryGroups == null)
                {
                    userCategoryGroups = new CategoryGroupsModel()
                    {
                        CategoryModel = usercategory,
                        CategoryModelId = usercategory.Id,
                        Name = "Horror",
                        Order = 1
                    };
                    
                    _userContext.Add(userCategoryGroups);
                    _userContext.SaveChanges();
                }

                userCategoryGroupsId = userCategoryGroups.Id;

                var usercategoryitems = _userContext.CategoryItems
                    .Include(u => u.CategoryGroupsModel)
                    .ThenInclude(u=>u.CategoryModel)
                    .FirstOrDefault(u => u.CategoryGroupsModel.CategoryModel.Id == filmsId);

                if (usercategoryitems == null)
                {
                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "IT",
                        Order = 1,
                        Comment = "Jump scares!",
                        CategoryGroupsId = userCategoryGroupsId,
                        CategoryGroupsModel = userCategoryGroups
                    };
                    _userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Hereditary",
                        Order = 2,
                        Comment = "Psychological",
                        CategoryGroupsId = userCategoryGroupsId
                    };
                    _userContext.Add(usercategoryitems);
                    _userContext.SaveChanges();

                
                }
            }
           

        }
    }
}
