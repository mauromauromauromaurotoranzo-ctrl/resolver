'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    ResolverChat?: {
      init: (config: any) => void
      destroy: () => void
    }
  }
}

export function ChatbotWidget() {
  useEffect(() => {
    // NEXT_PUBLIC_API_URL viene como http://localhost:8000/api/v1 desde docker-compose
    // pero el widget ya agrega /api/v1 internamente, así que necesitamos solo la base
    const rawApi = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    const apiEndpoint = rawApi.replace(/\/api\/v1\/?$/, '')
    
    // Initialize widget script
    const initWidget = () => {
      // Check if already initialized
      if (window.ResolverChat) {
        return
      }

      // Create script tag to load widget from dev server
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'http://localhost:5173/src/index.tsx'
      script.async = true
      
      script.onload = () => {
        // Wait a bit for the module to initialize
        setTimeout(() => {
          if (window.ResolverChat) {
            window.ResolverChat.init({
              apiEndpoint, // e.g. http://localhost:8000
              position: 'bottom-right',
              primaryColor: '#3B82F6',
              botName: 'Resolver Assistant',
              showOnLoad: false,
              delayBeforeShow: 0,
              onLeadQualified: (lead: any) => {
                console.log('Lead qualified:', lead)
              },
            })
          }
        }, 500)
      }
      
      script.onerror = () => {
        console.warn('Failed to load chatbot widget. Make sure chatbot-widget is running on port 5173')
      }
      
      document.head.appendChild(script)

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script)
        }
        if (window.ResolverChat) {
          window.ResolverChat.destroy()
        }
      }
    }

    const cleanup = initWidget()
    return cleanup
  }, [])

  return null
}
