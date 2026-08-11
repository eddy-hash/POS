import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart POS System',
  description: 'Professional Point of Sale System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CurrencyProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="bottom-center"
              containerStyle={{
                zIndex: 99999,
                bottom: 20,
              }}
              toastOptions={{
                style: {
                  background: 'transparent',
                  boxShadow: 'none',
                  padding: 0,
                  margin: 0,
                  maxWidth: '100%',
                  pointerEvents: 'none',
                },
                className: '!bg-transparent !shadow-none !p-0',
              }}
            />
          </ThemeProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
