'use client';

import './globals.css'
import { Web3ModalProvider } from '../src/components/Web3ModalProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3ModalProvider>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  )
} 