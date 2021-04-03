using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Rannc.Models
{
    public class CategoryItemsViewModel
    {
        public string Name { get; set; }

        public string Group { get; set; }

        public string Order { get; set; }

        public string Comment { get; set; }
        public string CategoryModelId { get; set; }

    }
}
