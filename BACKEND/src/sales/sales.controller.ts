import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  private readonly logger = new Logger(SalesController.name);
  constructor(private salesService: SalesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSaleDto: any, @Request() req) {
    this.logger.log('Creating sale...');
    const sale = await this.salesService.create(createSaleDto, req.user.id);
    return { success: true, data: sale };
  }

  @Get()
  async findAll(@Request() req) {
    this.logger.log('Fetching sales...');
    const sales = await this.salesService.findAll(req.user.id);
    return { success: true, data: sales };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const sale = await this.salesService.findOne(id);
    return { success: true, data: sale };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.salesService.remove(id);
    return { success: true };
  }
}
