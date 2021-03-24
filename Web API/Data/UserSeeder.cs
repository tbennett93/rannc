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
        private UserContext userContext;
        private IPasswordHasherService passwordHasher;
        private ITokenService iTokenService;
        public UserSeeder(UserContext userContext, IPasswordHasherService passwordHasher, ITokenService iTokenService)
        { 
            this.userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
            this.passwordHasher = passwordHasher ?? throw new ArgumentNullException(nameof(passwordHasher));
            this.iTokenService = iTokenService ?? throw new ArgumentNullException(nameof(iTokenService));
        }

        public void Seed()
        {
            var user = userContext.LoginModel.FirstOrDefault(m => m.UserName == "johndoe");
            var passwordSalt = passwordHasher.GetSalt();
            if (user == null) {
                user = new LoginModel()
                {
                    UserName = "JohnDoe",
                    Password = passwordHasher.GetHashedSaltedPassword("JohnDoePassword", passwordSalt),
                    PasswordSalt = passwordSalt,
                    RefreshToken = iTokenService.GenerateRefreshToken(),
                    RefreshTokenExpiryTime = iTokenService.RefreshTokenTime
                };
                userContext.Add(user);
                userContext.SaveChanges();
            }
            var usercategory = userContext.Categories
                .Include(u=>u.LoginModel)
                .FirstOrDefault(u=>u.LoginModelId == user.Id);
            if (usercategory == null)
            {
                usercategory = new CategoryModel()
                {
                    Name = "films",
                    LoginModelId = user.Id
                };
                userContext.Add(usercategory);
                userContext.SaveChanges();

                var filmsId = usercategory.Id;
                
                usercategory = new CategoryModel()
                {
                    Name = "albums",
                    LoginModelId = user.Id
                };
                userContext.Add(usercategory);
                userContext.SaveChanges();

                var albumsId = usercategory.Id;



                var usercategoryitems = userContext.CategoryItems
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
                    userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "The departed",
                        Group = "Thriller",
                        Order = 2,
                        Comment = "Favorite Director",
                        CategoryModelId = filmsId
                    };
                    userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Dunkirk",
                        Group = "Thriller",
                        Order = 3,
                        Comment = "Emosh",
                        CategoryModelId = filmsId
                    };
                    userContext.Add(usercategoryitems);
                    //userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Superbad",
                        Group = "Comedy",
                        Order = 1,
                        Comment = "All time fave",
                        CategoryModelId = filmsId
                    };
                    userContext.Add(usercategoryitems);

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "40 year old virgin",
                        Group = "Comedy",
                        Order = 2,
                        Comment = "Classic",
                        CategoryModelId = filmsId
                    };
                    userContext.Add(usercategoryitems);
                    userContext.SaveChanges();

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "To Pimp a butterfly",
                        Order = 1,
                        CategoryModelId = albumsId
                    };
                    userContext.Add(usercategoryitems);

                    usercategoryitems = new CategoryItemsModel()
                    {
                        Name = "Good kid maad city",
                        Order = 2,
                        CategoryModelId = albumsId
                    };
                    userContext.Add(usercategoryitems);
                    userContext.SaveChanges();
                }
            }
           

        }
    }
}
