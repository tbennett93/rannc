using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Rannc.Models
{
    public class CategoryItemsModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int Order { get; set; }

        public string Comment { get; set; }

        [ForeignKey("CategoryGroupsModel")]
        [JsonIgnore]
        public long CategoryGroupsId{ get; set; }

        //Link to CategoriesModel - many category items per category
        [JsonIgnore]
        public CategoryGroupsModel CategoryGroupsModel { get; set; }
    }
}
