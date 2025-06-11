namespace FinalProjectLibrary.Helpers.Enums
{
    public static class Roles
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Admin = "Administratör";
        public const string User = "Användare";

        public static readonly List<string> AllRoles = new() { SuperAdmin, Admin, User};
    }
}
