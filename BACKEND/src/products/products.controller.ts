import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';
import { Public } from '../auth/decorators/permissions.decorator';

@Controller('products')
@UseGuards(RBACGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Permissions(Permission.PRODUCT_READ)
  async findAll(
    @Request() req,
    @Query('currency') currency?: string,
  ) {
    const displayCurrency = currency || 'TZS';
    return this.productsService.findAll(displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.PRODUCT_READ)
  async findOne(
    @Param('id') id: string,
    @Query('currency') currency?: string,
  ) {
    const displayCurrency = currency || 'TZS';
    return this.productsService.findOne(+id, displayCurrency);
  }

  @Post()
  @Permissions(Permission.PRODUCT_CREATE)
  async create(@Body() createProductDto: any) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @Permissions(Permission.PRODUCT_UPDATE)
  async update(@Param('id') id: string, @Body() updateProductDto: any) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Permissions(Permission.PRODUCT_DELETE)
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
