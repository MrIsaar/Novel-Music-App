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
    public class SequencerController : ControllerBase
    {
        private readonly ApplicationContext _context;

        public SequencerController(ApplicationContext context)
        {
            _context = context;
        }

        // GET: api/sequencer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sequencer>>> GetSequencer()
        {
            return await _context.Sequencer.ToListAsync();
        }

        // GET: api/withCreationID/1
        [HttpGet("withCreationID/{id}")]
        public async Task<ActionResult<Sequencer>> GetSequencerWithCreationID(int id)
        {
            var res = await _context.Sequencer.Where(p => p.CreationID == id).FirstOrDefaultAsync();
            if (res == null)
            {
                // pop message
                return new BadRequestObjectResult(new { message = "Can't get Sequencer." });
            }
            return res;
        }
    }
}
