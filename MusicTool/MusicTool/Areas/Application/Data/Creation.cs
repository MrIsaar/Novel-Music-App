using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data
{

    public class Creation
    {
        public Creation()
        {
            CreationObject = new HashSet<CreationObject>();
        }
        public int CreationID { get; set; }
        public string? Name { get; set; }
        
        [JsonConverter(typeof(RawStringValueConverter))]
        public string? WorldRules { get; set; }

        public DateTime CreationDate { get; set; }
        
        public DateTime LastEditDate { get; set; }
        // marking this as virtual allows for lazy loading, but we don't want that for now
        // almost anytime that we want the creation, we also want the objects and the sequencer
        public virtual ICollection<CreationObject> CreationObject { get; set; }
        public virtual Sequencer Sequencer { get; set; }

    }

    public class CreationSummaryDto
    {
        public int CreationID { get; set; }
        public string? Name { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastEditDate { get; set; }
        public int CreationObjectCount { get; set; }
    }

}

