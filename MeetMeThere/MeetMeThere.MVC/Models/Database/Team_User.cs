//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace MeetMeThere.MVC.Models.Database
{
    using System;
    using System.Collections.Generic;
    
    public partial class Team_User
    {
        public int Id { get; set; }
        public Nullable<int> TeamId { get; set; }
        public Nullable<int> UserId { get; set; }
    
        public virtual Team Team { get; set; }
        public virtual User User { get; set; }
    }
}
