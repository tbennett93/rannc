using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rannc.Models
{
    public class CategoryGroupsViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Order { get; set; }
        public CategoryItemsViewModel[] Items { get; set; }
    }
}
