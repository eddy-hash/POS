#!/bin/bash

echo "========================================="
echo "🔧 FIXING USER-SPECIFIC DATA FILTERING"
echo "========================================="

# 1. Update Products Service
echo "📦 Updating Products Service..."
cat > src/products/products.service.ts << 'PRODUCTS'
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private currencyService: CurrencyService,
  ) {}

  async create(createProductDto: any, userId: number): Promise<Product> {
    this.logger.log('Creating product...');

    if (!createProductDto.sku) {
      createProductDto.sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    createProductDto.quantity = createProductDto.quantity || 0;
    createProductDto.isActive = true;
    createProductDto.userId = userId;

    const product = new Product();
    Object.assign(product, createProductDto);
    
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const products = await this.productRepository.find({
      where: { userId, isActive: true },
      relations: { category: true },
    });

    return products.map((product) => {
      const price = product.price || 0;
      const costPrice = product.costPrice || 0;
      
      const convertedPrice = this.currencyService.convert(price, 'TZS', displayCurrency);
      const convertedCostPrice = this.currencyService.convert(costPrice, 'TZS', displayCurrency);

      return {
        ...product,
        formattedPrice: this.currencyService.formatCurrencyFull(convertedPrice, displayCurrency),
        formattedPriceShort: this.currencyService.formatCurrency(convertedPrice, displayCurrency, true),
        formattedCostPrice: this.currencyService.formatCurrencyFull(convertedCostPrice, displayCurrency),
        displayCurrency,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const price = product.price || 0;
    const costPrice = product.costPrice || 0;
    
    const convertedPrice = this.currencyService.convert(price, 'TZS', displayCurrency);
    const convertedCostPrice = this.currencyService.convert(costPrice, 'TZS', displayCurrency);

    return {
      ...product,
      formattedPrice: this.currencyService.formatCurrencyFull(convertedPrice, displayCurrency),
      formattedPriceShort: this.currencyService.formatCurrency(convertedPrice, displayCurrency, true),
      formattedCostPrice: this.currencyService.formatCurrencyFull(convertedCostPrice, displayCurrency),
      displayCurrency,
    };
  }

  async update(id: number, updateProductDto: any): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    product.quantity = (product.quantity || 0) + quantity;
    const updatedProduct = await this.productRepository.save(product);
    return updatedProduct;
  }
}
PRODUCTS

# 2. Update Products Controller
echo "📦 Updating Products Controller..."
cat > src/products/products.controller.ts << 'PRODUCTSCTRL'
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('products')
@UseGuards(RBACGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Permissions(Permission.PRODUCT_READ)
  async findAll(@Request() req, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.productsService.findAll(req.user.id, displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.PRODUCT_READ)
  async findOne(@Param('id') id: string, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.productsService.findOne(+id, displayCurrency);
  }

  @Post()
  @Permissions(Permission.PRODUCT_CREATE)
  async create(@Body() createProductDto: any, @Request() req) {
    return this.productsService.create(createProductDto, req.user.id);
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
PRODUCTSCTRL

# 3. Update Purchases Service
echo "📦 Updating Purchases Service..."
cat > src/purchases/purchases.service.ts << 'PURCHASES'
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseItem } from './entities/purchase-item.entity';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { CurrencyService } from '../common/services/currency.service';

@Injectable()
export class PurchasesService {
  private readonly logger = new Logger(PurchasesService.name);

  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseItem)
    private purchaseItemRepository: Repository<PurchaseItem>,
    private currencyService: CurrencyService,
  ) {}

  async create(createPurchaseDto: CreatePurchaseDto, userId: number): Promise<PurchaseOrder> {
    this.logger.log('Creating purchase order...');

    const lastOrder = await this.purchaseOrderRepository
      .createQueryBuilder('order')
      .orderBy('order.orderNumber', 'DESC')
      .getOne();

    let orderNumber = 'PO-0001';
    if (lastOrder && lastOrder.orderNumber) {
      const match = lastOrder.orderNumber.match(/PO-(\d+)/);
      if (match) {
        const lastNum = parseInt(match[1], 10);
        const nextNum = lastNum + 1;
        orderNumber = `PO-${String(nextNum).padStart(4, '0')}`;
      }
    }

    const { items, supplier, notes, totalAmount } = createPurchaseDto;

    let calculatedTotal = 0;
    for (const item of items) {
      calculatedTotal += item.quantity * item.price;
    }

    const finalTotal = totalAmount || calculatedTotal;

    const purchaseOrder = this.purchaseOrderRepository.create({
      orderNumber,
      userId,
      supplier: supplier || null,
      totalAmount: finalTotal,
      notes: notes || '',
      status: 'active',
      orderDate: new Date(),
    });

    const savedOrder = await this.purchaseOrderRepository.save(purchaseOrder);

    for (const item of items) {
      const totalPrice = item.quantity * item.price;
      const purchaseItem = this.purchaseItemRepository.create({
        purchaseOrderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: totalPrice,
      });
      await this.purchaseItemRepository.save(purchaseItem);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const orders = await this.purchaseOrderRepository.find({
      where: { userId },
      relations: { items: true },
      order: { orderDate: 'DESC' },
    });

    return orders.map(order => {
      const totalAmount = parseFloat(order.totalAmount as any) || 0;
      const convertedTotal = this.currencyService.convert(totalAmount, 'TZS', displayCurrency);
      
      return {
        ...order,
        formattedTotal: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
        formattedTotalShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
        displayCurrency,
        totalTZS: totalAmount,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: { items: true },
    });
    
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);

    const totalAmount = parseFloat(order.totalAmount as any) || 0;
    const convertedTotal = this.currencyService.convert(totalAmount, 'TZS', displayCurrency);

    return {
      ...order,
      formattedTotal: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
      formattedTotalShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
      displayCurrency,
      totalTZS: totalAmount,
    };
  }

  async remove(id: number, userId: number): Promise<void> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id, userId },
    });
    if (!order) throw new NotFoundException(`Purchase order with ID ${id} not found`);
    await this.purchaseOrderRepository.remove(order);
  }
}
PURCHASES

# 4. Update Purchases Controller
echo "📦 Updating Purchases Controller..."
cat > src/purchases/purchases.controller.ts << 'PURCHASECTRL'
import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { Permission } from '../auth/enums/roles.enum';
import { RBACGuard } from '../auth/guards/rbac.guard';

@Controller('purchases')
@UseGuards(RBACGuard)
export class PurchasesController {
  constructor(private purchasesService: PurchasesService) {}

  @Get()
  @Permissions(Permission.PURCHASE_READ)
  async findAll(@Request() req, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.purchasesService.findAll(req.user.id, displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.PURCHASE_READ)
  async findOne(@Param('id') id: string, @Request() req, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.purchasesService.findOne(+id, displayCurrency);
  }

  @Post()
  @Permissions(Permission.PURCHASE_CREATE)
  async create(@Body() createPurchaseDto: CreatePurchaseDto, @Request() req) {
    return this.purchasesService.create(createPurchaseDto, req.user.id);
  }

  @Delete(':id')
  @Permissions(Permission.PURCHASE_DELETE)
  async remove(@Param('id') id: string, @Request() req) {
    return this.purchasesService.remove(+id, req.user.id);
  }
}
PURCHASECTRL

# 5. Update Expenses Service
echo "📦 Updating Expenses Service..."
cat > src/expenses/expenses.service.ts << 'EXPENSES'
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

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const expenses = await this.expenseRepository.find({
      where: { userId },
      order: { expenseDate: 'DESC' },
    });

    return expenses.map((expense) => {
      const amount = expense.amount || 0;
      const convertedAmount = this.currencyService.convert(amount, 'TZS', displayCurrency);
      
      return {
        ...expense,
        formattedAmount: this.currencyService.formatCurrencyFull(convertedAmount, displayCurrency),
        formattedAmountShort: this.currencyService.formatCurrency(convertedAmount, displayCurrency, true),
        displayCurrency,
        amountTZS: amount,
      };
    });
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    const amount = expense.amount || 0;
    const convertedAmount = this.currencyService.convert(amount, 'TZS', displayCurrency);

    return {
      ...expense,
      formattedAmount: this.currencyService.formatCurrencyFull(convertedAmount, displayCurrency),
      formattedAmountShort: this.currencyService.formatCurrency(convertedAmount, displayCurrency, true),
      displayCurrency,
      amountTZS: amount,
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
EXPENSES

# 6. Update Expenses Controller
echo "📦 Updating Expenses Controller..."
cat > src/expenses/expenses.controller.ts << 'EXPENSESCTRL'
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
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
  async findAll(@Request() req, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.expensesService.findAll(req.user.id, displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.EXPENSE_READ)
  async findOne(@Param('id') id: string, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.expensesService.findOne(+id, displayCurrency);
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
EXPENSESCTRL

# 7. Update Customers Service
echo "📦 Updating Customers Service..."
cat > src/customers/customers.service.ts << 'CUSTOMERS'
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
    const customer = new Customer();
    customer.userId = userId;
    customer.name = createCustomerDto.name || '';
    customer.email = createCustomerDto.email || '';
    customer.phone = createCustomerDto.phone || '';
    customer.address = createCustomerDto.address || '';

    const savedCustomer = await this.customerRepository.save(customer);
    return savedCustomer;
  }

  async findAll(userId: number, displayCurrency: string = 'TZS'): Promise<any[]> {
    const customers = await this.customerRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const customersWithSpent = await Promise.all(
      customers.map(async (customer) => {
        const sales = await this.saleRepository.find({
          where: { customerName: customer.name },
        });
        const totalSpent = sales.reduce((sum, s) => sum + Number(s.netAmount || 0), 0);
        const convertedTotal = this.currencyService.convert(totalSpent, 'TZS', displayCurrency);

        return {
          ...customer,
          totalSpent,
          formattedTotalSpent: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
          formattedTotalSpentShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
          displayCurrency,
          totalSpentTZS: totalSpent,
        };
      }),
    );

    return customersWithSpent;
  }

  async findOne(id: number, displayCurrency: string = 'TZS'): Promise<any> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const sales = await this.saleRepository.find({
      where: { customerName: customer.name },
    });
    const totalSpent = sales.reduce((sum, s) => sum + Number(s.netAmount || 0), 0);
    const convertedTotal = this.currencyService.convert(totalSpent, 'TZS', displayCurrency);

    return {
      ...customer,
      totalSpent,
      formattedTotalSpent: this.currencyService.formatCurrencyFull(convertedTotal, displayCurrency),
      formattedTotalSpentShort: this.currencyService.formatCurrency(convertedTotal, displayCurrency, true),
      displayCurrency,
      totalSpentTZS: totalSpent,
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
CUSTOMERS

# 8. Update Customers Controller
echo "📦 Updating Customers Controller..."
cat > src/customers/customers.controller.ts << 'CUSTOMERSCTRL'
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
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
  async findAll(@Request() req, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.customersService.findAll(req.user.id, displayCurrency);
  }

  @Get(':id')
  @Permissions(Permission.CUSTOMER_READ)
  async findOne(@Param('id') id: string, @Query('currency') currency?: string) {
    const displayCurrency = currency || 'TZS';
    return this.customersService.findOne(+id, displayCurrency);
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
CUSTOMERSCTRL

echo ""
echo "========================================="
echo "✅ ALL SERVICES UPDATED SUCCESSFULLY!"
echo "========================================="
echo ""
echo "📋 Changes made:"
echo "  ✅ Products - Filtered by userId"
echo "  ✅ Purchases - Filtered by userId"
echo "  ✅ Expenses - Filtered by userId"
echo "  ✅ Customers - Filtered by userId"
echo ""
echo "🚀 Restart your backend: npm run dev"
echo "========================================="
