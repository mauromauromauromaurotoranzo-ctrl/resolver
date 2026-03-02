# Resolver Landing Page

Landing page institucional para Resolver.tech - Agencia de desarrollo potenciada por IA.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animaciones:** Framer Motion
- **Iconos:** Lucide React

## Estructura

```
landing/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── sections/          # Secciones de la landing
│   └── ui/               # Componentes UI reutilizables
├── public/               # Assets estáticos
└── lib/                  # Utilidades
```

## Secciones

1. **Hero** - Value proposition principal + CTA
2. **Services** - Servicios de desarrollo a medida
3. **Process** - Cómo trabajamos (metodología)
4. **Models** - Modelos de engagement
5. **Case Studies** - Casos de éxito
6. **Pricing** - Precios y paquetes
7. **FAQ** - Preguntas frecuentes
8. **Contact** - Formulario + chatbot
9. **Footer** - Links y info legal

## Desarrollo

```bash
cd apps/landing
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy en Vercel.
