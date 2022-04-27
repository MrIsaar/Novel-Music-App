using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MusicTool.Areas.Application.Data;

public enum AccessLevel
{
    Read, Write, Owner
}
public class Access
{
    public int AccessID { get; set; }
    public string UserID { get; set; }
    public int CreationID { get; set; }
    public AccessLevel AccessLevel { get; set; }
    public virtual Creation Creation { get; set; }

}

