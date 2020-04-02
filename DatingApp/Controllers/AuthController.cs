using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.Dto;
using DatingApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _mapper = mapper;
            _config = config;
            _repo = repo;

        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            //validate request
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("User already Exists");


            var userToCreate = _mapper.Map<User>(userForRegisterDto);


            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);
            var userToReturn = _mapper.Map<UserForDetailedDto>(createdUser);


            //Status code of CreateRoutes but cannot use it now because no metod do get the user 
            return CreatedAtRoute("GetUser", new {Controller = "Users", id = createdUser.Id}, createdUser);
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(UserForLoginDto userforLoginDto, int id)
    {
    
            var userFromRepo = await _repo.Login(userforLoginDto.Username.ToLower(), userforLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username),
            };
            
            var Key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config
                .GetSection("AppSettings:Token").Value));
            
            var creds = new SigningCredentials(Key,
            SecurityAlgorithms.HmacSha512Signature);  

            var tokenDescripter = new SecurityTokenDescriptor 
            {
                Subject = new ClaimsIdentity(claims), 
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescripter);

            var user = _mapper.Map<UserForUpdateTokenDto>(userFromRepo);
           
            return Ok(new {
                token = tokenHandler.WriteToken(token),
                user
            });
        }

    }
}