import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('purchases')
@UseGuards(RBACGuard)
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get()
  @Permissions(Permission.PURCHASE_READ)
  async findAll(@Request() req) {
    return this.purchasesService.findAll(req.user.id);
  }

  @Get(':id')
  @Permissions(Permission.PURCHASE_READ)
  async findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(+id);
  }

  @Post()
  @Permissions(Permission.PURCHASE_CREATE)
  async create(@Body() createPurchaseDto: any, @Request() req) {
    return this.purchasesService.create(createPurchaseDto, req.user.id);
  }

  @Delete(':id')
  @Permissions(Permission.PURCHASE_DELETE)
  async remove(@Param('id') id: string, @Request() req) {
    return this.purchasesService.remove(+id, req.user.id);
  }
}
