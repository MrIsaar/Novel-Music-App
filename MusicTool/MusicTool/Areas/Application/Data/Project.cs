using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Identity.Data;

// Add profile data for application users by adding properties to the MusicToolUser class
public class Project
{
    public int ProjectID { get; set; }
    public string? Name { get; set; }
    public string? ProjectJson { get; set; }
    public int UserID { get; set; }
    
}

