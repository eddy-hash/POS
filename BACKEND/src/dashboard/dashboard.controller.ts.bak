import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from '../auth/decorators/permissions.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Public()
  async getStats(
    @Request() req,
    @Query('currency') currency?: string,
  ) {
    const userId = req.user?.id || 1;
    const displayCurrency = currency || 'TZS';
    return this.dashboardService.getStats(userId, displayCurrency);
  }
}
