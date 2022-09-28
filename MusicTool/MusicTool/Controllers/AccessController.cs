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

        // POST api/save
        [HttpPost("save/{id}")]
        public async Task<ActionResult<Access>> saveAccess( int id,[FromBody] Access access)
        {
            if (String.IsNullOrEmpty(access.UserID))
            {
                return new BadRequestObjectResult(new { message = "Please login first." });
            }

            if (String.IsNullOrEmpty(access.CreationID.ToString()))
            {
                return new BadRequestObjectResult(new { message = "CreationID is empty." });
            }

            if (String.IsNullOrEmpty(access.AccessLevel.ToString()))
            {
                return new BadRequestObjectResult(new { message = "AccessLevel is empty." });
            }

            var res = await _context.Access.Where(p => p.CreationID == access.CreationID).ToListAsync();
            if (res != null && res.Count > 0)
            {
                return new BadRequestObjectResult(new { message = "CreationID already exists." });
            }

            await _context.Access.AddAsync(access);
            await _context.SaveChangesAsync();

            var res2 = await _context.Access.Where((p => p.CreationID == access.CreationID)).FirstOrDefaultAsync();
            if (res2 == null || String.IsNullOrEmpty(res2.CreationID.ToString()))
            {
                // pop message
                return new BadRequestObjectResult(new { message = "Invalid CreationID, try again." });
            }
            return res2;
        }
    }
}
