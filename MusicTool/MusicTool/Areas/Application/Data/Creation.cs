using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data
{

    public class Creation
    {
        public Creation()
        {
            Object = new HashSet<Object>();
        }
        public int CreationID { get; set; }
        public string? Name { get; set; }
        public string? WorldRules { get; set; }

        public DateTime CreationDate { get; set; }
        
        public DateTime LastEditDate { get; set; }
        public virtual ICollection<Object> Object { get; set; }

    }

}

