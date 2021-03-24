using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Rannc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RankableController : ControllerBase
    {

        private static readonly string[] Summaries = new[]
        {
            "Gone Girl", "Marriage Story", "Dunkirk"
        };

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return Summaries;
        }
    }
}