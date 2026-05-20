import type { Metadata, Viewport } from 'next'
import { JetBrains_Mono, Geist } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Zellij Cheatsheet — The Interactive Shortcut Reference',
  description:
    'A developer-first interactive web reference for Zellij, the terminal multiplexer. Find shortcuts, modes, workflows, and learn how Zellij compares to tmux.',
  keywords: ['Zellij', 'terminal multiplexer', 'shortcuts', 'tmux alternative', 'terminal', 'Linux', 'Unix'],
  authors: [{ name: 'Satyam Soni' }],
  openGraph: {
    title: 'Zellij Cheatsheet — The Interactive Shortcut Reference',
    description:
      'A developer-first interactive web reference for Zellij, the terminal multiplexer.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zellij Cheatsheet — The Interactive Shortcut Reference',
    description:
      'A developer-first interactive web reference for Zellij, the terminal multiplexer.',
  },
  alternates: {
    canonical: 'https://zellij.dev/cheatsheet',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="any"
        />
      </head>
      <body
        className={`${geist.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}