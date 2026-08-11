import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('expenses')
@UseGuards(RBACGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  @Permissions(Permission.EXPENSE_READ)
  async findAll(@Request() req) {
    return this.expensesService.findAll(req.user.id);
  }

  @Get(':id')
  @Permissions(Permission.EXPENSE_READ)
  async findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Post()
  @Permissions(Permission.EXPENSE_CREATE)
  async create(@Body() createExpenseDto: any, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @Put(':id')
  @Permissions(Permission.EXPENSE_UPDATE)
  async update(@Param('id') id: string, @Body() updateExpenseDto: any, @Request() req) {
    return this.expensesService.update(+id, updateExpenseDto, req.user.id);
  }

  @Delete(':id')
  @Permissions(Permission.EXPENSE_DELETE)
  async remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(+id, req.user.id);
  }
}
