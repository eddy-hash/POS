import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: any, userId: number): Promise<Customer> {
    const customer = this.customerRepository.create({
      ...createCustomerDto,
      userId,
    });
    const saved = await this.customerRepository.save(customer);
    return saved as unknown as Customer;
  }

  async findAll(userId: number): Promise<Customer[]> {
    return this.customerRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, userId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: any, userId: number): Promise<Customer> {
    const customer = await this.findOne(id, userId);
    Object.assign(customer, updateCustomerDto);
    const updated = await this.customerRepository.save(customer);
    return updated as unknown as Customer;
  }

  async remove(id: number, userId: number): Promise<void> {
    const customer = await this.findOne(id, userId);
    await this.customerRepository.remove(customer);
  }
}
