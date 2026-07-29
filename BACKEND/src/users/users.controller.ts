import { Controller, Get, Put, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      },
    };
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateProfileDto: any) {
    const userId = req.user.id;
    const updated = await this.usersService.updateProfile(userId, updateProfileDto);
    return {
      success: true,
      data: updated,
      message: 'Profile updated successfully',
    };
  }

  @Post('change-password')
  async changePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
    const userId = req.user.id;
    await this.usersService.changePassword(userId, body.currentPassword, body.newPassword);
    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  @Put('preferences')
  async updatePreferences(@Request() req, @Body() preferences: any) {
    const userId = req.user.id;
    const updated = await this.usersService.updatePreferences(userId, preferences);
    return {
      success: true,
      data: updated,
      message: 'Preferences updated successfully',
    };
  }

  @Get('notifications/preferences')
  async getNotificationPreferences(@Request() req) {
    const userId = req.user.id;
    const preferences = await this.usersService.getNotificationPreferences(userId);
    return {
      success: true,
      data: preferences,
    };
  }

  @Put('notifications/preferences')
  async updateNotificationPreferences(@Request() req, @Body() preferences: any) {
    const userId = req.user.id;
    const updated = await this.usersService.updateNotificationPreferences(userId, preferences);
    return {
      success: true,
      data: updated,
      message: 'Notification preferences updated',
    };
  }
}
