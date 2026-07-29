import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: any, @Request() req) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    let products;
    if (search && search.trim() !== '') {
      products = await this.productsService.search(search);
    } else {
      products = await this.productsService.findAll();
    }
    return {
      success: true,
      data: products,
    };
  }

  @Get('low-stock')
  async getLowStock(@Query('threshold') threshold?: string) {
    const thresholdNum = threshold ? parseInt(threshold) : 10;
    const products = await this.productsService.getLowStock(thresholdNum);
    return {
      success: true,
      data: products,
    };
  }

  @Get('out-of-stock')
  async getOutOfStock() {
    const products = await this.productsService.getOutOfStock();
    return {
      success: true,
      data: products,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return {
      success: true,
      data: product,
    };
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: any) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productsService.remove(id);
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ) {
    const product = await this.productsService.updateStock(id, quantity);
    return {
      success: true,
      data: product,
      message: 'Stock updated successfully',
    };
  }
}
