using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace FinalProjectLibrary.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
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
            var mailMessage = new MailMessage(_fromAddress, to, subject, body);
            await _smtpClient.SendMailAsync(mailMessage);
        }
    }
}