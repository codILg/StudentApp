using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class MaterialType
    {
        public int Id { get; set; }          // Primarni ključ
        public string Name { get; set; }=string.Empty;   // Naziv tipa (npr. Video, PDF)
        public string Description { get; set; }=string.Empty;
    }
}