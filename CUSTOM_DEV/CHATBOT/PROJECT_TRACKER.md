# Project Tracker
## Chatbot de Pre-venta - Resolver.tech

**Última actualización:** 2025-03-03  
**Estado general:** 🚧 En diseño / Documentación  
**Versión:** 0.1.0

---

## 📊 Resumen de Estado

| Fase | Progreso | Estado |
|------|----------|--------|
| Diseño y Documentación | ████████░░ 80% | 🚧 En curso |
| Setup Técnico | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Desarrollo Backend | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Desarrollo Frontend | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Testing | ░░░░░░░░░░ 0% | ⏳ Pendiente |
| Deploy | ░░░░░░░░░░ 0% | ⏳ Pendiente |

**Overall Progress:** 15%

---

## ✅ Completado

### Documentación
- [x] README principal del proyecto
- [x] Product Requirements Document (PRD)
- [x] System Prompt v1.0
- [x] Technical Specification inicial
- [x] Estructura de carpetas del repositorio

### Definiciones Clave
- [x] Objetivos del chatbot
- [x] Flujos principales de conversación
- [x] Stack tecnológico propuesto
- [x] Arquitectura general
- [x] Estructura de base de datos

---

## 🚧 En Progreso

### Diseño
- [ ] Refinar prompts del sistema según feedback
- [ ] Diseñar avatar/personaje visual del bot
- [ ] Mockups de UI del widget
- [ ] Definir nombre final del asistente

### Planificación
- [ ] Priorizar features para MVP
- [ ] Estimar tiempos más precisos
- [ ] Asignar responsabilidades (si hay equipo)

---

## ⏳ Pendiente

### Setup Inicial
- [ ] Crear cuenta OpenRouter
- [ ] Crear cuenta Calendly para agendamiento
- [ ] Setup cuenta de email (Resend/SendGrid)
- [ ] Configurar dominio/subdominio para API
- [ ] Setup repositorio Laravel

### Backend
- [ ] Migraciones de base de datos
- [ ] Modelos Eloquent
- [ ] ChatSessionService
- [ ] LLMService con OpenRouter
- [ ] API Endpoints (REST)
- [ ] EstimatorService
- [ ] LeadQualificationService
- [ ] PDFGeneratorService
- [ ] Integración Calendly
- [ ] Sistema de emails/notificaciones

### Frontend
- [ ] Setup proyecto React + Vite
- [ ] Componente ChatWidget
- [ ] Sistema de mensajes y estado
- [ ] Quick replies / buttons
- [ ] Typing indicator
- [ ] Responsive design
- [ ] Persistencia local (localStorage)
- [ ] Animaciones y transiciones

### Integraciones
- [ ] Conectar frontend con backend API
- [ ] WebSocket para tiempo real (opcional)
- [ ] Analytics y tracking

### Testing
- [ ] Tests unitarios backend
- [ ] Tests de integración API
- [ ] Testing manual de flujos
- [ ] A/B testing setup

### Deploy
- [ ] Configuración servidor staging
- [ ] CI/CD pipeline
- [ ] SSL/certificados
- [ ] Monitoreo (Telescope, logs)
- [ ] Deploy a producción

### Post-launch
- [ ] Análisis de conversaciones
- [ ] Refinamiento de prompts
- [ ] Optimización de conversiones
- [ ] Documentación de uso interno

---

## 🎯 Milestones

| Fecha objetivo | Milestone | Estado |
|----------------|-----------|--------|
| 2025-03-10 | Documentación completa y aprobada | 🚧 En curso |
| 2025-03-17 | Setup técnico listo | ⏳ Pendiente |
| 2025-03-31 | MVP funcional en staging | ⏳ Pendiente |
| 2025-04-07 | Testing y refinamiento | ⏳ Pendiente |
| 2025-04-14 | Deploy a producción | ⏳ Pendiente |
| 2025-04-21 | Primera iteración de mejoras | ⏳ Pendiente |

---

## 📝 Notas y Decisiones

### 2025-03-03
- **Decisión:** Usar OpenRouter en lugar de OpenAI directo por flexibilidad de modelos
- **Pendiente:** Confirmar si se usará React o Vue para el widget
- **Idea:** Considerar integración con WhatsApp/Telegram además del web widget

### Decisiones pendientes
- [ ] Nombre final del asistente (Reso vs. otros)
- [ ] Colores y branding del widget
- [ ] Si incluir video/voz en futuras versiones
- [ ] Estrategia de pricing para clientes que lleguen por el bot

---

## 🐛 Issues Conocidos

*Ninguno todavía*

---

## 💡 Ideas Futuras

- Integración multi-canal (mismo bot en web, WhatsApp, Telegram)
- Análisis de sentimiento en tiempo real
- Reconocimiento de voz para input
- Dashboard admin para ver conversaciones en vivo
- ML para scoring de leads basado en historial
- Templates de proyectos por industria
- Integración con CRM (HubSpot, Salesforce)

---

## 📈 Métricas a Trackear

Desde el día 1:
- Número de sesiones iniciadas
- Tasa de completitud del flujo
- Tiempo promedio de conversación
- Leads calificados generados
- Meetings agendados
- Propuestas descargadas
- CSAT (satisfacción del usuario)

---

*Este documento debe actualizarse al final de cada sesión de trabajo*
