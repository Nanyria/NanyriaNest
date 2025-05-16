namespace FinalProjectLibrary.Helpers.Enums
{
    public static class AdminRoles
    {
        public const string SuperAdmin = "SuperAdmin";
        public const string Librarian = "Librarian";

        public static readonly List<string> AllRoles = new() { SuperAdmin, Librarian };
    }
}
