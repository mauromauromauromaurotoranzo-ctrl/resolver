# Resolver Backoffice

Panel de administración para gestionar el chatbot de pre-venta.

## Funcionalidades

### 📊 Dashboard
- Estadísticas en tiempo real
- Leads nuevos
- Tasa de conversión
- Proyectos por industria

### 👥 Gestión de Leads
- Listado completo con filtros
- Vista detalle de cada lead
- Cambio de estado (nuevo → contactado → propuesta → cerrado)
- Notas internas
- Asignación a team members

### 🤖 Configuración del Bot
- Editor de system prompts
- Selección de modelo LLM por defecto
- Configuración de flujo conversacional
- A/B testing de mensajes

### ⚙️ Administración
- Gestión de usuarios admin
- Logs de conversaciones
- Configuración de notificaciones
- Integraciones (email, calendly)

## Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **State Management:** Zustand
- **Charts:** Recharts
- **Icons:** Lucide React

## Desarrollo

```bash
cd apps/backoffice
npm install
npm run dev
```

## Build

```bash
npm run build
```
