#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Application.Data;
using MusicTool.Data;

namespace MusicTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public AccessController(ApplicationContext context)
        {
            _context = context;
        }


        // GET: api/access
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Access>>> GetAccess()
        {
            return await _context.Access.ToListAsync();
        }

        // POST api/getCreationID/with_userID/{id}
        [HttpGet("getCreationID/with_userID/{id}")]
        public async Task<List<int>> GetCreationIDList(string id)
        {
            /*            var res = await _context.Access.Where(p => p.UserID == userID).ToListAsync(); // get Access obj
                        return res;*/
            var list = from item in _context.Access
                       where item.UserID == id
                       select item.CreationID;
            return await list.ToListAsync();
        }

    }
}
