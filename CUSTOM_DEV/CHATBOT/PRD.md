# Product Requirements Document (PRD)
## Chatbot de Pre-venta y Toma de Requisitos

**Proyecto:** Resolver.tech - Unidad de Desarrollo a Medida  
**Versión:** 1.0  
**Fecha:** 2025-03-03  
**Estado:** 🚧 En diseño

---

## 1. Visión

Crear un asistente conversacional inteligente para el sitio web de Resolver que califique leads, eduque prospectos sobre nuestro modelo de trabajo, recolecte requisitos de proyecto y genere estimaciones preliminares — todo de forma automatizada pero con opción de escalar a humano cuando sea necesario.

### Objetivos de Negocio
- Reducir tiempo de calificación de leads en 70%
- Aumentar tasa de conversión de visitantes a meetings en 3x
- Generar propuestas preliminares automáticas
- Escalar capacidad de pre-venta sin aumentar headcount proporcionalmente

---

## 2. Usuarios Objetivo

| Segmento | Necesidad | Contexto |
|----------|-----------|----------|
| **Exploradores** | Entender qué hace Resolver | Llegan al site, no saben si somos fit |
| **Con problema definido** | Ver si podemos ayudar | Tienen dolor específico, buscan solución |
| **Con presupuesto** | Obtener estimación rápida | Quieren saber rangos antes de comprometerse |
| **Decisores técnicos** | Evaluar capacidad técnica | CTOs, tech leads validando proveedor |

---

## 3. Flujos Principales

### 3.1 Flujo de Descubrimiento (Discovery)

```
ENTRADA → CLASIFICACIÓN → EXPLORACIÓN → CALIFICACIÓN → ESTIMACIÓN → CTA
```

**Paso 1: Clasificación de Intención**
- ¿Qué tipo de solución buscás?
  - Software a medida (app, plataforma, sistema)
  - Agente IA para automatizar procesos
  - No estoy seguro, necesito asesoramiento

**Paso 2: Exploración de Contexto**
- ¿En qué industria trabajás?
- ¿Qué problema querés resolver?
- ¿Qué usás hoy para esto?
- ¿Cuántas personas se ven impactadas?

**Paso 3: Calificación de Proyecto**
- ¿Tenés un timeline definido?
- ¿Hay presupuesto asignado? (rango)
- ¿Quién toma la decisión final?
- ¿Evaluás otras alternativas?

**Paso 4: Estimación Inteligente**
- Análisis de complejidad basado en respuestas
- Rango de inversión presentado
- Rango de tiempo estimado
- Factores que pueden variar la estimación

**Paso 5: Call to Action**
- Agendar diagnóstico gratuito (Calendly)
- Descargar propuesta personalizada (PDF)
- Hablar con especialista (handoff a humano)
- Recibir info por email para revisar después

### 3.2 Flujos Secundarios

**FAQ / Educación**
- ¿Cómo funciona el modelo de desarrollo potenciado por IA?
- ¿Qué diferencia a Resolver de una agencia tradicional?
- ¿El código es mío al finalizar?
- ¿Cómo garantizan calidad si usan IA?

**Objeciones**
- "Es muy caro" → Explicar ROI y comparativa
- "No confío en la IA" → Explicar modelo híbrido
- "Necesito ver casos similares" → Mostrar case studies relevantes
- "El timeline es muy largo" → Explicar fases y MVP posible

---

## 4. Features

### Fase 1: MVP (Semanas 1-3)

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| Widget embebible | Componente React/Vue para integrar en sitio | Must have |
| Flujo estructurado | 5-7 preguntas guiadas con lógica condicional | Must have |
| Respuestas IA | Generación dinámica con LLM (no scripts rígidos) | Must have |
| Estimador básico | Tabla de complejidad → rangos de $ y tiempo | Must have |
| Guardado de leads | Persistir datos en base de datos | Must have |
| Notificaciones email | Alertar al equipo Resolver de nuevos leads calificados | Must have |
| Integración Calendly | Permitir agendar meeting desde el chat | Must have |

### Fase 2: Smart Features (Semanas 4-6)

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| Clasificación IA de complejidad | Análisis semántico de descripciones | Should have |
| Generación PDF | Propuesta personalizada descargable | Should have |
| Sugerencia de paquete | "Basado en tu caso, te recomendamos..." | Should have |
| Detección de objeciones | Palabras clave → respuestas preparadas | Should have |
| Handoff inteligente | Escalar a humano según criterios | Should have |
| Seguimiento email | Drip campaign post-interacción | Nice to have |

### Fase 3: Optimización (Continuo)

| Feature | Descripción | Prioridad |
|---------|-------------|-----------|
| A/B testing de flujos | Probar variantes de preguntas/CTAs | Nice to have |
| Analytics avanzado | Funnel de conversión, drop-off points | Nice to have |
| Reentrenamiento continuo | Mejorar prompts según conversaciones exitosas | Nice to have |
| Integración CRM | Sync con HubSpot/Salesforce | Nice to have |

---

## 5. Criterios de Éxito (KPIs)

| Métrica | Baseline | Target Fase 1 | Target Fase 2 |
|---------|----------|---------------|---------------|
| Tasa de inicio de conversación | N/A | 15% de visitantes | 25% de visitantes |
| Tasa de completitud de flujo | N/A | 40% | 60% |
| Leads calificados generados | Manual | 10/semana | 30/semana |
| Tiempo hasta meeting agendado | 3-5 días | <24 horas | Instantáneo |
| Tasa de conversión lead→meeting | 20% | 35% | 50% |
| Satisfacción usuario (CSAT) | N/A | >4/5 | >4.5/5 |

---

## 6. Consideraciones de UX/UI

### Personalidad del Bot
- Nombre tentativo: "Reso" o "Resolver Assistant"
- Voz: Profesional pero cercana, entusiasta por IA sin ser hype
- No decir "soy un bot" — decir "soy el asistente de Resolver"
- Usar emojis con moderación
- Ser honesto sobre limitaciones

### Diseño Visual
- Avatar distintivo (logo de Resolver o personaje)
- Indicador de "escribiendo..." cuando procesa IA
- Opciones rápidas (buttons) + input libre
- Transiciones suaves entre pasos
- Mobile-first (60%+ tráfico será mobile)

---

## 7. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| IA da estimaciones incorrectas | Alto | Siempre mostrar rangos, disclaimer de estimación preliminar |
| Usuarios abandonan flujo largo | Medio | Versión corta vs. versión completa; guardar progreso |
| Spam / leads de baja calidad | Medio | Validación de email, CAPTCHA si es necesario |
| Expectativas irreales | Alto | Claridad en qué es estimación vs. propuesta formal |
| Dependencia de LLM externo | Medio | Fallback a flujo scripteado si API cae |

---

## 8. Dependencias

- Sitio web de Resolver (dónde se embeberá)
- Cuenta OpenRouter/OpenAI para LLM
- Cuenta Calendly para agendamiento
- Servidor/backend para persistencia
- Sistema de email (SendGrid/Resend)

---

## 9. Timeline Tentativo

```
Semana 1: Setup técnico + arquitectura + diseño de flujos
Semana 2: Desarrollo backend + integración LLM
Semana 3: Frontend widget + testing + deploy MVP

Semana 4: Analytics + mejoras de UX
Semana 5: Generación PDF + features smart
Semana 6: Testing + refinamiento

Ongoing: Optimización basada en datos
```

---

## 10. Notas y Decisiones Pendientes

- [ ] Definir nombre del asistente
- [ ] Confirmar stack tecnológico final
- [ ] Diseñar avatar/personaje visual
- [ ] Crear cuenta de servicios (OpenRouter, Calendly, etc.)
- [ ] Definir proceso de handoff a humano
- [ ] Escribir disclaimers legales para estimaciones

---

*Documento vivo — actualizar según avance del proyecto*
