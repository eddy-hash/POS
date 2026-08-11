import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('customers')
@UseGuards(RBACGuard)
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @Permissions(Permission.CUSTOMER_READ)
  async findAll(@Request() req) {
    return this.customersService.findAll(req.user.id);
  }

  @Get(':id')
  @Permissions(Permission.CUSTOMER_READ)
  async findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Post()
  @Permissions(Permission.CUSTOMER_CREATE)
  async create(@Body() createCustomerDto: any, @Request() req) {
    return this.customersService.create(createCustomerDto, req.user.id);
  }

  @Put(':id')
  @Permissions(Permission.CUSTOMER_UPDATE)
  async update(@Param('id') id: string, @Body() updateCustomerDto: any, @Request() req) {
    return this.customersService.update(+id, updateCustomerDto, req.user.id);
  }

  @Delete(':id')
  @Permissions(Permission.CUSTOMER_DELETE)
  async remove(@Param('id') id: string, @Request() req) {
    return this.customersService.remove(+id, req.user.id);
  }
}
