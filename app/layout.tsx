import type React from "react"
// ... existing code ...
import type { Metadata } from "next"

// <CHANGE> Update metadata for D-Imara platform
export const metadata: Metadata = {
  title: "D-Imara - Smart Learning & Micro-Funding",
  description: "Gamified learning platform with blockchain-based education credits",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}


import './globals.css'