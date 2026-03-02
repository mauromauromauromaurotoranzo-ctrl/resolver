# Resolver Chatbot Platform

Sistema completo de pre-venta y toma de requisitos para Resolver.tech

## Arquitectura

```
apps/
├── landing/              # Landing page explicando servicios
│   └── Next.js 14 + Tailwind
│
├── chatbot-widget/       # Widget embebible flotante
│   └── React 18 + TypeScript + Vite
│
├── backoffice/           # Panel de administración
│   └── React 18 + Laravel API
│
└── api/                  # Backend API
    └── Laravel 11 + PostgreSQL
```

## Flujo del Sistema

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   LANDING PAGE  │────▶│  CHATBOT WIDGET  │────▶│      API        │
│  (Marketing)    │     │ (Resolver Asst.) │     │   (Laravel)     │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                              ┌───────────────────────────┘
                              ▼
                    ┌──────────────────┐
                    │    BACKOFFICE    │
                    │  (Panel Admin)   │
                    │                  │
                    │ • Config prompts │
                    │ • Ver leads      │
                    │ • Gestionar      │
                    │   propuestas     │
                    └──────────────────┘
```

## Descripción de Componentes

### 1. Landing Page
- Explica servicios de Resolver
- Casos de éxito
- Modelos de precios
- Botón flotante derecha para abrir chat

### 2. Chatbot Widget
- Botón flotante (esquina inferior derecha)
- Ventana de chat modal
- Flujo conversacional guiado por IA
- Recolecta información del proyecto
- Genera lead calificado

### 3. Backoffice
- Autenticación admin
- Configuración de prompts del bot
- Listado de leads recibidos
- Vista detalle de cada lead
- Estados: Nuevo → En revisión → Contactado → Propuesta enviada → Cerrado
- Notas internas
- Asignación a team members

### 4. API (Backend)
- Endpoints REST para chat
- Gestión de sesiones
- Integración con OpenRouter (LLM)
- Almacenamiento de leads
- Notificaciones email
- Auth para backoffice

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Landing | Next.js 14, Tailwind CSS |
| Widget | React 18, TypeScript, Vite |
| Backoffice | React 18, Tailwind, Laravel API |
| API | Laravel 11, PostgreSQL, Redis |
| LLM | OpenRouter API |
| Email | Resend / SendGrid |

## Desarrollo

Cada app tiene su propio README con instrucciones específicas.

## Deploy

- Landing: Vercel
- Widget: CDN / Vercel
- Backoffice: Vercel
- API: Laravel Forge + DigitalOcean
