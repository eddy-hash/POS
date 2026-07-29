import {
  Controller,
  Get,
  Post,
  Patch,
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
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  private readonly logger = new Logger(ExpensesController.name);
  constructor(private expensesService: ExpensesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createExpenseDto: any, @Request() req) {
    this.logger.log('Creating expense...');
    const expense = await this.expensesService.create(createExpenseDto, req.user.id);
    return { success: true, data: expense };
  }

  @Get()
  async findAll(@Request() req) {
    this.logger.log('Fetching expenses...');
    const expenses = await this.expensesService.findAll(req.user.id);
    return { success: true, data: expenses };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const expense = await this.expensesService.findOne(id, req.user.id);
    return { success: true, data: expense };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: any,
    @Request() req,
  ) {
    const expense = await this.expensesService.update(id, updateExpenseDto, req.user.id);
    return { success: true, data: expense };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    await this.expensesService.remove(id, req.user.id);
    return { success: true };
  }
}
