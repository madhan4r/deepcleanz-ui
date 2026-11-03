import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Home deep cleaning in Chennai. See your price in 30 seconds, pay only after you inspect.',
  title: 'DeepCleanz',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en-IN">
      <body>
        {children}
      </body>
    </html>
  )
}
