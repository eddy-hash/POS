import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);
  constructor(
    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: any, userId: number): Promise<Expense> {
    const expense = this.expenseRepository.create({ ...createExpenseDto, userId });
    return await this.expenseRepository.save(expense) as unknown as Expense;
  }

  async findAll(userId: number): Promise<{ expenses: Expense[]; total: number }> {
    const expenses = await this.expenseRepository.find({
      where: { userId },
      order: { expenseDate: 'DESC' },
    });
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return { expenses, total };
  }

  async findOne(id: number, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id, userId } });
    if (!expense) throw new NotFoundException(`Expense with ID ${id} not found`);
    return expense;
  }

  async findByCategory(category: string, userId: number): Promise<{ expenses: Expense[]; total: number }> {
    const expenses = await this.expenseRepository.find({
      where: { userId, category },
      order: { expenseDate: 'DESC' },
    });
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return { expenses, total };
  }

  async findByDateRange(userId: number, startDate: Date, endDate: Date): Promise<{ expenses: Expense[]; total: number }> {
    const expenses = await this.expenseRepository.find({
      where: { userId, expenseDate: Between(startDate, endDate) },
      order: { expenseDate: 'DESC' },
    });
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return { expenses, total };
  }

  async update(id: number, updateExpenseDto: any, userId: number): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    Object.assign(expense, updateExpenseDto);
    return await this.expenseRepository.save(expense) as unknown as Expense;
  }

  async remove(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expenseRepository.remove(expense);
  }

  async getTotalByCategory(userId: number): Promise<any> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .groupBy('expense.category')
      .getRawMany();
    const grandTotal = result.reduce((sum, item) => sum + Number(item.total), 0);
    return { categories: result, grandTotal };
  }

  async getTotalAmount(userId: number): Promise<{ total: number }> {
    const result = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId = :userId', { userId })
      .select('SUM(expense.amount)', 'total')
      .getRawOne();
    return { total: Number(result?.total) || 0 };
  }
}
