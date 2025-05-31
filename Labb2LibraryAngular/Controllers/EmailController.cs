using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinalProjectLibrary.Controllers
{

        [ApiController]
        [Route("api/[controller]")]
        public class EmailController : ControllerBase
        {
            private readonly IEmailService _emailService;

            public EmailController(IEmailService emailService)
            {
                _emailService = emailService;
            }

            [HttpPost("send")]
            public async Task<IActionResult> SendTestEmail()
            {
                var to = "nanyria@hotmail.com";
                var subject = "Test Email from NyriaNest";
                var body = "This is a test email sent from your ASP.NET Core application using Gmail SMTP. If you received this, your configuration works!";

                await _emailService.SendEmailAsync(to, subject, body);
                return Ok("Test email sent to nanyria@hotmail.com (if configuration is correct).");
            }
    }
    

}
