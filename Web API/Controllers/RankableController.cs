using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rannc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
