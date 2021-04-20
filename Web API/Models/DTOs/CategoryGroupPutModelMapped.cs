using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rannc.Models
{
    public class CategoryGroupPutModelMapped
    {

        public long Id { get; set; }
        public string Name { get; set; }
        public long Order { get; set; }
        public long CategoryId { get; set; }
     
     
    }
}
