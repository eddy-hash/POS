'use client';
import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';

export default function CurrencySwitcher() {
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const { isDark } = useTheme();

  return (
    <div className={`flex items-center gap-1 sm:gap-2 p-1 rounded-lg border ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'} shadow-sm transition-colors`}>
      <button onClick={() => setCurrency('TZS')} className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${currency === 'TZS' ? 'bg-blue-600 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
        <span className="text-base sm:text-lg">🇹🇿</span><span className="hidden xs:inline">TZS</span><span className="xs:hidden">TZS</span>
      </button>
      <button onClick={() => setCurrency('USD')} className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${currency === 'USD' ? 'bg-blue-600 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
        <span className="text-base sm:text-lg">🇺🇸</span><span className="hidden xs:inline">USD</span><span className="xs:hidden">USD</span>
      </button>
      <span className={`text-[8px] sm:text-[10px] px-1 sm:px-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>1 USD = {exchangeRate} TZS</span>
    </div>
  );
}
