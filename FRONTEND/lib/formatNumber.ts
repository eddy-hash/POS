export function formatShortNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  if (absNum >= 1_000_000_000) return sign + (absNum / 1_000_000_000).toFixed(1) + 'B';
  if (absNum >= 1_000_000) return sign + (absNum / 1_000_000).toFixed(1) + 'M';
  if (absNum >= 1_000) return sign + (absNum / 1_000).toFixed(1) + 'K';
  return sign + absNum.toString();
}
export function formatCurrencyShort(amount: number): string {
  return `TSh ${formatShortNumber(amount)}`;
}
export function formatNumberWithCommas(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}
