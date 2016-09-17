using System;

namespace MeetMeThere.MVC.Helper
{
    public class ImageProvider
    {
        private static readonly string[] List =
        {
            "christian.jpg",
            "jenny.jpg",
            "nan.jpg",
            "tom.jpg",
            "stevie.jpg",
            "joe.jpg",
            "zoe.jpg"
        };
        static readonly Random Rnd = new Random();

        public static string GetRandomImgPath()
        {
            var r = Rnd.Next(List.Length);
            return "~/assets/img/" + List[r];
        }
    }
}