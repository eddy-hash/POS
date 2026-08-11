import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
    private currencyService: CurrencyService,
  ) {}

  async create(createExpenseDto: any, userId: number): Promise<Expense> {
    this.logger.log('Creating expense...');

    const expense = new Expense();
    expense.userId = userId;
    expense.category = createExpenseDto.category || 'Uncategorized';
    expense.description = createExpenseDto.description || '';
    expense.amount = createExpenseDto.amount || 0;
    expense.expenseDate = createExpenseDto.expenseDate || new Date();
    expense.receiptPath = createExpenseDto.receiptPath || '';

    const savedExpense = await this.expenseRepository.save(expense);
    return savedExpense;
  }

  async findAll(userId: number): Promise<any[]> {
    const expenses = await this.expenseRepository.find({
      where: { userId },
      order: { expenseDate: 'DESC' },
    });

    return expenses.map((expense) => ({
      ...expense,
      formattedAmount: this.currencyService.formatCurrencyFull(expense.amount, 'TZS'),
      formattedAmountShort: this.currencyService.formatCurrency(expense.amount, 'TZS', true),
    }));
  }

  async findOne(id: number): Promise<any> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return {
      ...expense,
      formattedAmount: this.currencyService.formatCurrencyFull(expense.amount, 'TZS'),
      formattedAmountShort: this.currencyService.formatCurrency(expense.amount, 'TZS', true),
    };
  }

  async update(id: number, updateExpenseDto: any, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id, userId } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    Object.assign(expense, updateExpenseDto);
    const updatedExpense = await this.expenseRepository.save(expense);
    return updatedExpense;
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.expenseRepository.findOne({ where: { id, userId } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    await this.expenseRepository.remove(expense);
  }
}
