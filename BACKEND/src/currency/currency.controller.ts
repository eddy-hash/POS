import { Controller, Get, Query } from '@nestjs/common';
import { CurrencyService } from '../common/services/currency.service';
import { Public } from '../auth/decorators/permissions.decorator';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get('rates')
  @Public()
  getRates() {
    return {
      rates: this.currencyService.getAllRates(),
      symbols: {
        TZS: 'TSh',
        USD: '$',
        EUR: '€',
        GBP: '£',
        KES: 'KSh',
        UGX: 'USh',
      },
    };
  }

  @Get('convert')
  @Public()
  convert(
    @Query('amount') amount: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const value = parseFloat(amount) || 0;
    
    // ✅ Get exchange rate: how many 'to' per 1 'from'
    const rate = this.currencyService.getExchangeRate(from, to);
    const converted = value * rate;
    
    const toSymbol = this.currencyService.getSymbol(to);
    const fromSymbol = this.currencyService.getSymbol(from);

    return {
      from,
      to,
      amount: value,
      rate: rate,
      converted: converted,
      fromSymbol,
      toSymbol,
      formatted: this.currencyService.formatCurrency(converted, to),
    };
  }
}
