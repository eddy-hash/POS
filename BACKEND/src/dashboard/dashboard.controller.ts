import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    const userId = req.user.id;
    this.logger.log(`Fetching stats for user ${userId}`);
    const stats = await this.dashboardService.getStats(userId);
    return {
      success: true,
      data: stats,
    };
  }
}
