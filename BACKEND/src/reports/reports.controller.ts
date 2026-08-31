import { Controller, Get, Query, Request, Logger, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { Public } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);
  constructor(private reportsService: ReportsService) {}

  @Get('stats')
  @Public()
  async getStats(
    @Request() req,
    @Query('range') range: string = 'month',
    @Query('currency') currency: string = 'TZS',
  ) {
    this.logger.log(`📊 getStats: range=${range}, currency=${currency}`);
    const userId = req.user?.id || 1;
    return this.reportsService.getStats(userId, range, currency);
  }

  @Get('export/pdf')
  @Public()
  @UseGuards(JwtAuthGuard)
  async exportPdf(
    @Request() req,
    @Res() res: Response,
    @Query('range') range: string = 'month',
    @Query('currency') currency: string = 'TZS',
  ) {
    const userId = req.user.id;
    const pdfBuffer = await this.reportsService.generateReportPdf(userId, range, currency);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=report_${range}_${Date.now()}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  }
}