using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Rannc.Models
{
    public class TemplateLoggerModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        //Link to CategoryModel - many logs for 1 category
        [ForeignKey("CategoryModel")]
        [Required]
        public long CategoryModelId { get; set; }
        public CategoryModel CategoryModel { get; set; }

        [Required]
        public DateTime DateSaved { get; set; }
    }
}
