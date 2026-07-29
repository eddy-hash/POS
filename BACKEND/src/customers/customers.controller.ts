import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: any, @Request() req) {
    const customer = await this.customersService.create(createCustomerDto, req.user.id);
    return {
      success: true,
      data: customer,
      message: 'Customer created successfully',
    };
  }

  @Get()
  async findAll(@Request() req) {
    const customers = await this.customersService.findAll(req.user.id);
    return {
      success: true,
      data: customers,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const customer = await this.customersService.findOne(id, req.user.id);
    return {
      success: true,
      data: customer,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: any,
    @Request() req,
  ) {
    const customer = await this.customersService.update(id, updateCustomerDto, req.user.id);
    return {
      success: true,
      data: customer,
      message: 'Customer updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.customersService.remove(id, req.user.id);
    return {
      success: true,
      message: 'Customer deleted successfully',
    };
  }
}
