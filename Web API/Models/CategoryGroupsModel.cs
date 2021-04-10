using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Serialization;

namespace Rannc.Models
{
    public class CategoryGroupsModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public long Order { get; set; }
        [Required]
        [ForeignKey("CategoryModel")]
        public long CategoryModelId { get; set; }
        public CategoryModel CategoryModel { get; set; }
        public ICollection<CategoryItemsModel> CategoryItemsModels { get; set; }
    }
}
