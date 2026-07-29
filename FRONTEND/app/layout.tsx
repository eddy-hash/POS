import type { Metadata } from 'next'
import './globals.css'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Tally POS',
  description: 'Point of Sale System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster 
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'transparent',
                boxShadow: 'none',
                padding: 0,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
