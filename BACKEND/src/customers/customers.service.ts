import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { Sale } from '../sales/entities/sale.entity';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    private currencyService: CurrencyService,
  ) {}

  async create(createCustomerDto: any, userId: number): Promise<Customer> {
    this.logger.log('Creating customer...');

    const customer = new Customer();
    customer.userId = userId;
    customer.name = createCustomerDto.name || '';
    customer.email = createCustomerDto.email || '';
    customer.phone = createCustomerDto.phone || '';
    customer.address = createCustomerDto.address || '';

    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer;
  }

  async findAll(userId: number): Promise<any[]> {
    const customers = await this.customerRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    // Get total spent for each customer by name (since Sale uses customerName)
    const customersWithSpent = await Promise.all(
      customers.map(async (customer) => {
        const sales = await this.saleRepository.find({
          where: { customerName: customer.name },
        });
        const totalSpent = sales.reduce((sum, s) => sum + Number(s.netAmount || 0), 0);

        return {
          ...customer,
          totalSpent,
          formattedTotalSpent: this.currencyService.formatCurrencyFull(totalSpent, 'TZS'),
          formattedTotalSpentShort: this.currencyService.formatCurrency(totalSpent, 'TZS', true),
        };
      }),
    );

    return customersWithSpent;
  }

  async findOne(id: number): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const sales = await this.saleRepository.find({
      where: { customerName: customer.name },
    });
    const totalSpent = sales.reduce((sum, s) => sum + Number(s.netAmount || 0), 0);

    return {
      ...customer,
      totalSpent,
      formattedTotalSpent: this.currencyService.formatCurrencyFull(totalSpent, 'TZS'),
      formattedTotalSpentShort: this.currencyService.formatCurrency(totalSpent, 'TZS', true),
    };
  }

  async update(id: number, updateCustomerDto: any, userId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id, userId } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    Object.assign(customer, updateCustomerDto);
    const updatedCustomer = await this.customerRepository.save(customer);
    return updatedCustomer;
  }

  async remove(id: number, userId: number): Promise<void> {
    const customer = await this.customerRepository.findOne({ where: { id, userId } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.customerRepository.remove(customer);
  }
}
