using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data
{

    // Add profile data for application users by adding properties to the MusicToolUser class
    public class Sequencer
    {
        public int SequencerID { get; set; }
        public string? Json { get; set; }
        public int CreationID { get; set; }

        public virtual Creation Creation { get; set; }
    }
}

