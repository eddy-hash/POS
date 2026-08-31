import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RBACGuard } from '../auth/guards/rbac.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';

@Controller('sales')
@UseGuards(JwtAuthGuard, RBACGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  @Permissions(Permission.SALE_READ)
  async findAll(
    @Request() req,
    @Query('currency') currency?: string,
  ) {
    const displayCurrency = currency || 'TZS';
    return this.salesService.findAll(req.user.id, displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.SALE_READ)
  async findOne(
    @Param('id') id: string,
    @Query('currency') currency?: string,
  ) {
    const displayCurrency = currency || 'TZS';
    return this.salesService.findOne(+id, displayCurrency);
  }

  @Post()
  @Permissions(Permission.SALE_CREATE)
  async create(@Body() createSaleDto: any, @Request() req) {
    return this.salesService.create(createSaleDto, req.user.id);
  }

  @Delete(':id')
  @Permissions(Permission.SALE_DELETE)
  async remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
