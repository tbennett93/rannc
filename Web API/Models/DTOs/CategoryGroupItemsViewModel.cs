using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rannc.Models.DTOs
{
    public class CategoryGroupItemsViewModel
    {
        public string CategoryId { get; set; }

        public string CategoryName { get; set; }

        public CategoryGroupsViewModel[] Groups { get; set; }

    }
}
