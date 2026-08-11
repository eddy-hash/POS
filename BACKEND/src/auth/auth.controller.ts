import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/permissions.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { email: string; password: string }) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    const token = await this.authService.login(user);
    
    return {
      success: true,
      access_token: token.access_token,
      user: {
        id: user.id,
        name: user.name || 'User',
        email: user.email,
        role: user.role || 'viewer',
        permissions: user.permissions || [],
      },
    };
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }
}
