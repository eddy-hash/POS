import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('sales')
@UseGuards(RBACGuard)
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  @Permissions(Permission.SALE_READ)
  async findAll(@Request() req) {
    return this.salesService.findAll(req.user.id);
  }

  @Get(':id')
  @Permissions(Permission.SALE_READ)
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
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
