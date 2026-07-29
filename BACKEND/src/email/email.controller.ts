import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('test')
  async testEmail(@Body() body: { to: string; subject?: string; message?: string }) {
    const result = await this.emailService.sendEmail(
      body.to,
      body.subject || 'Test Email from Your App',
      body.message || '<h1>Hello!</h1><p>Your email setup is working correctly! ✅</p>'
    );
    return { 
      success: true, 
      message: 'Email sent successfully!', 
      data: result 
    };
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { email: string; name?: string }) {
    const result = await this.emailService.sendWelcomeEmail(
      body.email,
      body.name || 'User'
    );
    return { 
      success: true, 
      message: 'Welcome email sent!', 
      data: result 
    };
  }
}
