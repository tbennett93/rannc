using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Rannc.Models
{
    public class CategoryModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public long Id { get; set; }
        
        [Required]
        public string Name { get; set; }
        
        public DateTime DateCreated = DateTime.Now;

        //Link to LoginModel - many categories for 1 user
        [ForeignKey("LoginModel")]
        public long LoginModelId { get; set; }
        public LoginModel LoginModel { get; set; }

        public ICollection<CategoryGroupsModel> CategoryGroupsModels { get; set; }
    }
}
