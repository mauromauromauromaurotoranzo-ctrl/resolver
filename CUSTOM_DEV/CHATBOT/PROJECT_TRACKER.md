# Project Tracker
## Chatbot de Pre-venta - Resolver.tech

**Última actualización:** 2025-03-03  
**Estado general:** 🚧 En desarrollo activo  
**Versión:** 0.2.0

---

## 📊 Resumen de Estado

| Fase | Progreso | Estado |
|------|----------|--------|
| Diseño y Documentación | ██████████ 100% | ✅ Completado |
| Backend API (Laravel) | ████████░░ 80% | 🚧 En curso |
| Frontend Widget (React) | █████████░ 90% | 🚧 En curso |
| Landing Page | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Backoffice | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Testing | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Deploy | ░░░░░░░░░░ 0% | ⏳ Pendiente |

**Overall Progress:** 55%

---

## ✅ Completado

### Documentación
- [x] README principal del proyecto
- [x] Product Requirements Document (PRD)
- [x] System Prompt v1.0
- [x] Technical Specification inicial
- [x] Estructura de carpetas del repositorio

### Backend API (Laravel)
- [x] Estructura de directorios
- [x] Migraciones de base de datos (4 tablas)
- [x] Modelos Eloquent (ChatSession, ChatMessage, Lead, BotConfiguration)
- [x] LLMService con soporte multi-modelo (OpenRouter)
- [x] EstimatorService con lógica de complejidad
- [x] ChatController (endpoints principales)
- [x] AdminController (gestión de leads y config)
- [x] Rutas API definidas

### Frontend Widget (React + TypeScript + Vite)
- [x] Setup completo del proyecto
- [x] Tipos TypeScript
- [x] Servicio API
- [x] Hook useChat
- [x] Componente ChatWidget principal
- [x] MessageBubble con markdown básico
- [x] QuickReplies component
- [x] TypingIndicator animado
- [x] ChatInput con auto-resize
- [x] **ModelSelector (múltiples LLMs configurables)** ✅
- [x] Estilos CSS con Tailwind + animaciones
- [x] Demo HTML funcional

---

## 🚧 En Progreso

### Backend
- [ ] Middleware de autenticación para backoffice
- [ ] Jobs de notificación email
- [ ] Testing de endpoints

### Frontend
- [ ] Build para producción (CDN)
- [ ] Testing manual integrado con backend
- [ ] Optimizaciones de performance

---

## ⏳ Pendiente

### Landing Page
- [ ] Diseño de página institucional
- [ ] Integración del widget
- [ ] Secciones: Hero, Servicios, Casos, Precios, Contacto

### Backoffice
- [ ] Login/autenticación
- [ ] Dashboard con estadísticas
- [ ] Listado de leads
- [ ] Detalle de conversaciones
- [ ] Configuración de prompts
- [ ] Selector de modelos por defecto

### Infraestructura
- [ ] Cuenta OpenRouter configurada
- [ ] Servidor de staging
- [ ] CI/CD pipeline
- [ ] Dominio configurado

---

## 🎯 Milestones Actualizados

| Fecha objetivo | Milestone | Estado |
|----------------|-----------|--------|
| 2025-03-05 | Widget funcional con multi-modelo | 🚧 En curso |
| 2025-03-10 | Backend API completo + tests | ⏳ Pendiente |
| 2025-03-17 | Landing page + backoffice básico | ⏳ Pendiente |
| 2025-03-31 | MVP completo en staging | ⏳ Pendiente |
| 2025-04-14 | Deploy a producción | ⏳ Pendiente |

---

## 📝 Decisiones Recientes

### 2025-03-03
- ✅ **Widget con multi-modelo implementado**
  - Claude 3.5 Sonnet (default)
  - GPT-4o
  - Gemini Pro
  - Llama 3.1 70B
- Selector visual de modelos en el header del chat
- Cada modelo puede seleccionarse en tiempo real

---

## 💡 Próximos Pasos Sugeridos

1. **Probar el widget localmente** con `npm run dev`
2. **Conectar con backend real** (necesita Laravel corriendo)
3. **Crear landing page** simple para presentar Resolver
4. **Backoffice básico** para ver leads entrantes

¿Por dónde querés seguir? 🚀
