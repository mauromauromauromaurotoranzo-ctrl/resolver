# Chatbot de Pre-venta - Resolver.tech

> Asistente conversacional para calificación de leads, toma de requisitos y estimación de proyectos.

---

## 🎯 Objetivos

1. **Calificar leads** — Identificar si el prospecto es buen fit para Resolver
2. **Educar** — Explicar nuestro modelo de trabajo y diferenciadores
3. **Recolectar requisitos** — Entender la problemática del cliente
4. **Generar estimación** — Proporcionar rango de inversión/tiempo
5. **Convertir** — Agendar diagnóstico gratuito o entregar propuesta

---

## 📊 Estado del Proyecto

| Fase | Estado | Fecha Estimada |
|------|--------|----------------|
| Diseño de flujos | 🚧 En progreso | 2025-03-03 |
| Especificación técnica | ⏳ Pendiente | 2025-03-10 |
| Desarrollo MVP | ⏳ Pendiente | 2025-03-24 |
| Testing interno | ⏳ Pendiente | 2025-03-31 |
| Deploy a producción | ⏳ Pendiente | 2025-04-07 |

**Responsable:** Mauro + Equipo Resolver  
**Prioridad:** Alta  
**Esforzo estimado:** 4-6 semanas

---

## 📁 Documentación

### Documentos Principales
- [`PRD.md`](./PRD.md) — Product Requirements Document (requisitos completos)
- [`TECH_SPEC.md`](./TECH_SPEC.md) — Especificación técnica detallada

### Prompts y Personalidad
- [`PROMPTS/system-prompt.md`](./PROMPTS/system-prompt.md) — Prompt base del bot
- [`PROMPTS/flows/`](./PROMPTS/flows/) — Prompts específicos por flujo

### Flujos de Conversación
- [`FLOWS/discovery-flow.md`](./FLOWS/discovery-flow.md) — Flujo de descubrimiento
- [`FLOWS/pricing-flow.md`](./FLOWS/pricing-flow.md) — Explicación de precios
- [`FLOWS/estimator-logic.md`](./FLOWS/estimator-logic.md) — Lógica del estimador

### Arquitectura
- [`ARCHITECTURE/overview.md`](./ARCHITECTURE/overview.md) — Vista general del sistema
- [`ARCHITECTURE/api-endpoints.md`](./ARCHITECTURE/api-endpoints.md) — Endpoints del backend
- [`ARCHITECTURE/database-schema.md`](./ARCHITECTURE/database-schema.md) — Esquema de datos

---

## 💬 Flujos Principales

```
┌─────────────────────────────────────────────┐
│  INICIO: Saludo + Menú principal           │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   [Software]  [Agente IA]  [Explorar]
        │           │           │
        └───────────┴───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   DISCOVERY PHASE     │
        │   (5-7 preguntas)     │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   ESTIMACIÓN          │
        │   (Rango $ y tiempo)  │
        └───────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   CONVERSIÓN          │
        │   • Agendar cita      │
        │   • Descargar PDF     │
        │   • Hablar humano     │
        └───────────────────────┘
```

---

## 🔗 Integraciones Planificadas

| Servicio | Propósito | Prioridad |
|----------|-----------|-----------|
| Calendly | Agendamiento de citas | Alta |
| Email (SMTP/SendGrid) | Envío de resúmenes y propuestas | Alta |
| OpenRouter/OpenAI | Generación de respuestas NLU | Alta |
| CRM (HubSpot/Pipedrive) | Gestión de leads | Media |
| Analytics (Mixpanel) | Tracking de conversiones | Media |

---

## 📋 Checklist de Avance

### Fase 1: Diseño (Semana 1-2)
- [x] Definición de objetivos y KPIs
- [ ] PRD completo con historias de usuario
- [ ] Diseño de flujos de conversación
- [ ] Prompts base del sistema
- [ ] Lógica del estimador de proyectos

### Fase 2: Especificación Técnica (Semana 2)
- [ ] Stack tecnológico definido
- [ ] Arquitectura de sistemas
- [ ] API endpoints documentados
- [ ] Esquema de base de datos
- [ ] Wireframes del widget

### Fase 3: Desarrollo MVP (Semana 3-4)
- [ ] Backend Laravel (API REST)
- [ ] Frontend widget (React/Vue)
- [ ] Integración con LLM
- [ ] Sistema de memoria/contexto
- [ ] Integraciones (Calendly, Email)

### Fase 4: Testing (Semana 5)
- [ ] Tests unitarios
- [ ] Testing de flujos conversacionales
- [ ] Optimización de prompts
- [ ] Validación de estimaciones

### Fase 5: Deploy (Semana 6)
- [ ] Configuración de producción
- [ ] Monitoreo y logging
- [ ] Analytics implementado
- [ ] Documentación final

---

## 🎨 Voz y Personalidad del Bot

- **Nombre:** TBD (¿Resolver Assistant? ¿Rey?)
- **Tono:** Profesional pero cercano, entusiasta sobre IA sin ser hype
- **Valores:** Transparencia, eficiencia, partnership
- **No hacer:** Prometer lo que no podemos cumplir, usar jerga técnica innecesaria

---

## 📈 Métricas de Éxito

| Métrica | Target | Cómo medir |
|---------|--------|------------|
| Tasa de conversación a lead calificado | >30% | Formularios completos |
| Tiempo promedio de conversación | 3-5 min | Analytics |
| Precisión de estimaciones | ±20% vs propuesta final | Comparativa manual |
| Satisfacción usuario | >4/5 | Encuesta post-chat |
| Reducción tiempo pre-venta | 50% | Tiempo equipo comercial |

---

## 📝 Notas y Decisiones

### 2025-03-03 - Inicio del proyecto
- Decidido: Bot enfocado en pre-venta, no atención al cliente post-venta
- Decidido: Dos caminos claros desde el inicio (Software vs Agente IA)
- Pendiente: Definir nombre del asistente
- Pendiente: Confirmar stack tecnológico (¿Next.js para frontend o puro React?)

---

*Para ver el estado actual del proyecto, consultar este archivo y los checklists de cada fase.*
