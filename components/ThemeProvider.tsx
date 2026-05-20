'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ReactNode } from 'react'

const themes = ['terminal-dark', 'paper-light', 'gruvbox-warm', 'nightowl-blue']

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={themes}
    >
      {children}
    </NextThemesProvider>
  )
}