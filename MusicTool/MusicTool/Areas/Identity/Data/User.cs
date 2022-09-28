using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Identity.Data { 
   

// Add profile data for application users by adding properties to the MusicToolUser class
    public class User  // : IdentityUser
    {
            public User() { }

            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int UserID { get; set; }
            public string? Email { get; set; }
            public string? Password { get; set; }
    }
}