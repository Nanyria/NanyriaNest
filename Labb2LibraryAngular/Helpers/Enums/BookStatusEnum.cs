using System.ComponentModel;

namespace FinalProjectLibrary.Helpers.Enums
{
    public enum BookStatusEnum
    {
        [Description("Available")]
        Available,
        [Description("Reserved")]
        Reserved,
        [Description("Checked Out")]
        CheckedOut,
        [Description("Returned")]
        Returned,
        [Description("Overdue")]
        Overdue
    }
}
