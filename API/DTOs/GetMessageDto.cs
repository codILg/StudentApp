using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class GetMessageDto
    {
        public string Content { get; set; }=string.Empty;
        public DateTime CreationDate { get; set; }
        public UserDto User { get; set; }=default!;
        public int ThemeId { get; set; }
    }
}