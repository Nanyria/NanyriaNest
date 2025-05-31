using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace FinalProjectLibrary.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
        Task SendRegistrationEmailAsync(string to, string firstame, string userName, string password);
        Task SendRetrievePasswordEmailAsync(string to, string firstname, string userName, string password);
        Task SendBookBorrowedEmailAsync(string to, string firstname, string userName, string bookTitle, DateTime returnDate);
        Task SendBookReturnedEmailAsync(string to, string firstname, string userName, string bookTitle);
        Task SendBookOverdueEmailAsync(string to, string firstname, string userName, string bookTitle, DateTime dueDate);

    }

    public class EmailService : IEmailService
    {
        private readonly SmtpClient _smtpClient;
        private readonly string _fromAddress;

        public EmailService(IConfiguration configuration)
        {
            _fromAddress = configuration["Email:From"];
            _smtpClient = new SmtpClient(configuration["Email:SmtpHost"])
            {
                Port = int.Parse(configuration["Email:SmtpPort"]),
                Credentials = new NetworkCredential(
                    configuration["Email:Username"],
                    configuration["Email:Password"]),
                EnableSsl = true
            };
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            Console.WriteLine($"From: {_fromAddress}, To: {to}");
            if (string.IsNullOrWhiteSpace(_fromAddress))
                throw new InvalidOperationException("From address is not configured.");

            if (string.IsNullOrWhiteSpace(to))
                throw new ArgumentException("Recipient address cannot be empty.", nameof(to));

            try
            {
                // This will throw if the addresses are not valid
                var mailMessage = new MailMessage(_fromAddress, to, subject, body);
                await _smtpClient.SendMailAsync(mailMessage);
            }
            catch (FormatException ex)
            {
                // Log or handle invalid email address format
                throw new ArgumentException("Invalid email address format.", ex);
            }
            catch (SmtpException ex)
            {
                // Log or handle SMTP errors
                throw new InvalidOperationException("Failed to send email.", ex);
            }
        }

        public async Task SendRegistrationEmailAsync(string to, string firstame, string userName, string password)
        {
            Console.WriteLine($"From: {_fromAddress}, To: {to}, firstname: {firstame}, username {userName} password: {password}");
            var subject = "V�lkommen till NyriaNest!";
            var body = $"Hall� d�r, {firstame},\n\nKul att du vill bli medlem p� NyriaNest!\n\n" +
                $"H�r �r dina inloggningsuppgifter:\nAnv�ndarnamn: {userName}\nL�senord: {password}.";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendRetrievePasswordEmailAsync(string to, string firstname, string userName, string password)
        {
            var subject = "Gl�mt l�senord";
            var body = $"Hej {firstname},\n\n" +
                $"Du har beg�rt att �terst�lla ditt l�senord.\n\n" +
                $"H�r �r dina inloggningsuppgifter:\nAnv�ndarnamn: {userName}\nL�senord: {password}.";
            await SendEmailAsync(to, subject, body);
        }
        public async Task SendBookBorrowedEmailAsync(string to, string firstname, string userName, string bookTitle, DateTime returnDate)
        {
            var subject = "Bekr�ftelse av l�n";
            var body = $"Hej {firstname},\n\nH�r en en bekr�ftelse av ditt l�n av \"{bookTitle}\"." +
                $"\n �terl�mningsdatum:{returnDate:yyyy-MM-dd}\n Hoppas du gillar boken, l�mna g�rna en recession!";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendBookReturnedEmailAsync(string to, string firstname, string userName, string bookTitle)
        {
            var subject = "Bekr�ftelse av �terl�mning av bok";
            var body = $"Hej {userName},\n\nDu har precis �terl�mnat \"{bookTitle}\". Tack!\n L�mna g�rna en recenssion";
            await SendEmailAsync(to, subject, body);
        }

        public async Task SendBookOverdueEmailAsync(string to, string firstname, string userName, string bookTitle, DateTime dueDate)
        {
            var subject = "�terl�mningsdatum passerat";
            var body = $"Hej {firstname},\n\nBoken \"{bookTitle}\" skulle vara �terl�mnad {dueDate:yyyy-MM-dd}. V�nligen l�mna tillbaka boken s� fort som m�jligt.";
            await SendEmailAsync(to, subject, body);
        }
    }
}
    
