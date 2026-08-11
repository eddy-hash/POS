import { Controller, Get, Query, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Public } from '../auth/decorators/permissions.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('stats')
  @Public()
  async getStats(
    @Request() req,
    @Query('range') range: string = 'month',
    @Query('currency') currency: string = 'TZS',
  ) {
    const userId = req.user?.id || 1;
    return this.reportsService.getStats(userId, range, currency);
  }
}
