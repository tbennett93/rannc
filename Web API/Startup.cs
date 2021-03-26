using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Rannc.Data;
using Rannc.Models;
using Rannc.Services;

namespace Rannc
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddDbContext<UserContext>(opts =>
                //TODO in development, this looks at the secrets.json file. in deployment, this will need switching to 
                opts.UseSqlServer(Configuration["ConnectionStrings:ConnectionString/UserDB"]));


            services.AddAuthentication(opt => {
                    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = "http://localhost:44359",
                        ValidAudience = "http://localhost:4200",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenSecretKey"]))
                    };
                });

         
            services.AddControllers();

            //TODO tighten security on this - consider if the tightening is needed though if using https
            services.AddCors(options =>
            {
                options.AddPolicy("EnableCORS", builder =>
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });


            services.AddAutoMapper(typeof(Startup).Assembly);
            services.AddTransient<ITokenService, TokenService>();
            services.AddTransient<IPasswordHasherService, PasswordHasherService>();
            services.AddTransient<IAuthRepository, AuthRepository>();
            services.AddTransient<ICategoriesRepository, CategoriesRepository>();
            services.AddTransient<UserSeeder>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("EnableCORS");
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (env.IsDevelopment())
            {
                using (var scope = app.ApplicationServices.CreateScope())
                {
                    //creates an instance with prerequisites if any
                    var seeder = scope.ServiceProvider.GetService<UserSeeder>();
                    //making configure wait for seed to finish
                    //cannot make Configure async as it isn't expected to run asynchronously
                    seeder.Seed();
                }
            }
        }
    }
}
