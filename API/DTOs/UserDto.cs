using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public string Email { get; set; }=string.Empty;
        public string Username { get; set; }=string.Empty;

        public string Token { get; set; }=string.Empty;
    }
}