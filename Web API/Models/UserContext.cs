using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Rannc.Models
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {

        }

        public DbSet<LoginModel> LoginModel { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        public DbSet<CategoryGroupsModel> CategoryGroups { get; set; }
        public DbSet<CategoryItemsModel> CategoryItems { get; set; }
        public DbSet<TemplateLoggerModel> TemplatesLog { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LoginModel>()
                .HasIndex(u => u.UserName)
                .IsUnique();
            modelBuilder.Entity<LoginModel>().Property(p => p.Password).IsRequired();
            modelBuilder.Entity<LoginModel>().Property(p => p.PasswordSalt).IsRequired();
            modelBuilder.Entity<LoginModel>().Property(p => p.Password).IsRequired();

            modelBuilder.Entity<CategoryModel>().Property(p => p.DateCreated).IsRequired();
            modelBuilder.Entity<CategoryModel>().Property(p => p.LoginModelId).IsRequired();

            modelBuilder.Entity<CategoryItemsModel>().Property(p => p.Order).IsRequired();
            modelBuilder.Entity<CategoryItemsModel>().Property(p => p.CategoryGroupsId).IsRequired();



        }
        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    //base.OnModelCreating(modelBuilder);
        //    modelBuilder.Entity<LoginModel>().HasData(new LoginModel
        //    {
        //        Id = 1,
        //        UserName = "johndoe",
        //        Password = "def@123"
        //    });

    }


}
