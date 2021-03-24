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
                
                usercategory = new CategoryModel()
                {
                    Name = "albums",
                    LoginModelId = user.Id
                };
                _userContext.Add(usercategory);
                _userContext.SaveChanges();

                var albumsId = usercategory.Id;



                var usercategoryitems = _userContext.CategoryItems
                    .Include(u => u.CategoryModel)
                    .FirstOrDefault(u => u.CategoryModelId == filmsId);

                if (usercategoryitems == null)
                {
                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Gone Girl",
                        Group = "Thriller",
                        Order = 1,
                        Comment = "Top film",
                        CategoryModelId = filmsId
                    };
                    _userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "The departed",
                        Group = "Thriller",
                        Order = 2,
                        Comment = "Favorite Director",
                        CategoryModelId = filmsId
                    };
                    _userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Dunkirk",
                        Group = "Thriller",
                        Order = 3,
                        Comment = "Emosh",
                        CategoryModelId = filmsId
                    };
                    _userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Superbad",
                        Group = "Comedy",
                        Order = 1,
                        Comment = "All time fave",
                        CategoryModelId = filmsId
                    };
                    _userContext.Add(usercategoryitems);

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "40 year old virgin",
                        Group = "Comedy",
                        Order = 2,
                        Comment = "Classic",
                        CategoryModelId = filmsId
                    };
                    _userContext.Add(usercategoryitems);
                    _userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "To Pimp a butterfly",
                        Order = 1,
                        CategoryModelId = albumsId
                    };
                    _userContext.Add(usercategoryitems);

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Good kid maad city",
                        Order = 2,
                        CategoryModelId = albumsId
                    };
                    _userContext.Add(usercategoryitems);
                    _userContext.SaveChanges();
                }
            }
           

        }
    }
}
