﻿#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Identity.Data;
using MusicTool.Data;

namespace MusicTool.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IdentityContext _context;

        public UserController(IdentityContext context)
        {
            _context = context;
        }


        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetCreation()
        {
            return await _context.Users.ToListAsync();
        }

        // POST api/user
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(User user) {
            var res = await _context.Users.Where ((p =>p.Email==user.Email && p.Password == user.Password )).FirstOrDefaultAsync();
            if (res == null || String.IsNullOrEmpty( res.Email))
            {
                // pop message
                return new BadRequestObjectResult(new {message="Invalid user email or password." });
            }
            return res;
        }


        // POST api/user
        [HttpPost("signUp")]
        public async Task<ActionResult<User>> SignUp(User user)
        {
            if (String.IsNullOrEmpty(user.Email)) {
                return new BadRequestObjectResult(new { message = "Email can't be empty." });
            }

            if (String.IsNullOrEmpty(user.Password))
            {
                return new BadRequestObjectResult(new { message = "Password can't be empty." });
            }

            var res = await _context.Users.Where(p=>p.Email ==user.Email).ToListAsync();
            if (res != null && res.Count >0)
            {
                return new BadRequestObjectResult(new { message = "Email already exists." });
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return new OkObjectResult(new {message="Sign up success"});
        }
    }
}
