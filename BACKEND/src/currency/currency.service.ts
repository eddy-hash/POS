import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  private readonly rates: Record<string, number> = {
    TZS: 1,
    USD: 2600,
    EUR: 2800,
    GBP: 3300,
    KES: 20,
    UGX: 0.70,
  };

  private readonly symbols: Record<string, string> = {
    TZS: 'TSh',
    USD: '$',
    EUR: '€',
    GBP: '£',
    KES: 'KSh',
    UGX: 'USh',
  };

  getExchangeRate(from: string, to: string): number {
    from = from.toUpperCase();
    to = to.toUpperCase();

    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    if (fromRate === undefined || toRate === undefined) {
      return 1;
    }

    return fromRate / toRate;
  }

  convert(amount: number, from: string, to: string): number {
    from = from.toUpperCase();
    to = to.toUpperCase();

    const fromRate = this.rates[from];
    const toRate = this.rates[to];

    if (fromRate === undefined || toRate === undefined) {
      return amount;
    }

    const amountInTZS = amount * fromRate;
    return amountInTZS / toRate;
  }

  // ✅ SIMPLE FORMATTER - No Intl.NumberFormat issues
  formatNumber(amount: number): string {
    const absAmount = Math.abs(amount);
    const isNegative = amount < 0;
    const sign = isNegative ? '-' : '';

    // Handle different ranges
    if (absAmount >= 1_000_000_000) {
      return `${sign}${(absAmount / 1_000_000_000).toFixed(1)}B`;
    } else if (absAmount >= 1_000_000) {
      return `${sign}${(absAmount / 1_000_000).toFixed(1)}M`;
    } else if (absAmount >= 1_000) {
      return `${sign}${(absAmount / 1_000).toFixed(1)}K`;
    } else {
      return `${sign}${absAmount.toFixed(0)}`;
    }
  }

  // ✅ FULL FORMAT - With commas for full display
  formatNumberFull(amount: number): string {
    const parts = amount.toString().split('.');
    let integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Add commas every 3 digits
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (decimalPart) {
      return `${integerPart}.${decimalPart}`;
    }
    return integerPart;
  }

  // ✅ Format with abbreviation for dashboard cards
  formatCurrency(amount: number, currency: string, abbreviate: boolean = true): string {
    currency = currency.toUpperCase();
    const symbol = this.symbols[currency] || currency;

    if (!abbreviate) {
      return `${symbol} ${this.formatNumberFull(amount)}`;
    }

    const formatted = this.formatNumber(amount);
    return `${symbol} ${formatted}`;
  }

  // ✅ Full format without abbreviation
  formatCurrencyFull(amount: number, currency: string): string {
    currency = currency.toUpperCase();
    const symbol = this.symbols[currency] || currency;
    return `${symbol} ${this.formatNumberFull(amount)}`;
  }

  getAllRates(): Record<string, number> {
    return { ...this.rates };
  }

  getSymbol(currency: string): string {
    return this.symbols[currency.toUpperCase()] || currency;
  }

  isSupported(currency: string): boolean {
    return currency.toUpperCase() in this.rates;
  }

  getSupportedCurrencies(): string[] {
    return Object.keys(this.rates);
  }
}
