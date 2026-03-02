import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ChatbotWidget } from '@/components/ChatbotWidget'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Resolver.tech | Desarrollo Potenciado por IA',
  description: 'Agencia de desarrollo de software y agentes IA. Entregamos proyectos 3x más rápido y a menor costo usando inteligencia artificial.',
  keywords: 'desarrollo software, agentes IA, chatbots, automatización, desarrollo web, aplicaciones móviles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
        <ChatbotWidget />
      </body>
    </html>
  )
}
