export function formatCurrencyWithAbbreviation(amount: number, currency: string = 'TZS'): string {
  if (amount === 0) return `${currency} 0`;
  
  const absAmount = Math.abs(amount);
  let formattedAmount: string;
  let suffix = '';
  
  if (absAmount >= 1_000_000_000) {
    formattedAmount = (absAmount / 1_000_000_000).toFixed(1);
    suffix = 'B';
  } else if (absAmount >= 1_000_000) {
    formattedAmount = (absAmount / 1_000_000).toFixed(1);
    suffix = 'M';
  } else if (absAmount >= 1000) {
    formattedAmount = (absAmount / 1000).toFixed(1);
    suffix = 'K';
  } else {
    formattedAmount = absAmount.toString();
  }
  
  // Remove .0 if present
  if (formattedAmount.endsWith('.0')) {
    formattedAmount = formattedAmount.slice(0, -2);
  }
  
  const sign = amount < 0 ? '-' : '';
  return `${sign}${currency} ${formattedAmount}${suffix}`;
}

export function formatCurrencyFull(amount: number, currency: string = 'TZS'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatCurrency(amount: number, currency: string = 'TZS', abbreviate: boolean = true): string {
  if (abbreviate) {
    return formatCurrencyWithAbbreviation(amount, currency);
  }
  return formatCurrencyFull(amount, currency);
}
