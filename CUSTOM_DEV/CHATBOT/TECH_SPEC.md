# Technical Specification
## Chatbot de Pre-venta - Resolver.tech

**Versión:** 1.0  
**Fecha:** 2025-03-03  
**Estado:** 🚧 Borrador

---

## 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                     SITIO WEB RESOLVER                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           WIDGET CHATBOT (React/Vue)                │   │
│  │  • UI conversacional                               │   │
│  │  • Gestión de estado local                         │   │
│  │  • Envío/recepción de mensajes                     │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │ WebSocket / HTTP
┌─────────────────────────┼───────────────────────────────────┐
│              BACKEND LARAVEL (API)                        │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │           CHAT CONTROLLER                           │   │
│  │  • Recibir mensajes                                │   │
│  │  • Gestionar sesiones                              │   │
│  │  • Persistir datos                                 │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │         LLM SERVICE (OpenRouter/OpenAI)             │   │
│  │  • Generar respuestas                              │   │
│  │  • Analizar intenciones                            │   │
│  │  • Clasificar complejidad                          │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │        BUSINESS LOGIC SERVICES                      │   │
│  │  • EstimatorService                                │   │
│  │  • LeadQualificationService                        │   │
│  │  • PDFGeneratorService                             │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                   │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │     INTEGRATIONS (Calendly, Email, etc.)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Frontend Widget** | React 18 + TypeScript | Flexible, tipado, ecosystema maduro |
| **Build Tool** | Vite | Rápido, moderno, HMR |
| **Styling** | Tailwind CSS | Consistente con brand de Resolver |
| **Backend** | Laravel 11 | Stack existente, equipo familiarizado |
| **Base de Datos** | PostgreSQL | Mismo stack que otros proyectos |
| **Cache/Sessions** | Redis | Performance, manejo de estado |
| **LLM** | OpenRouter API | Flexibilidad de modelos, costos optimizados |
| **Email** | Resend / SendGrid | Confiable, buena entregabilidad |
| **PDF Generation** | Laravel DOMPDF | Integración nativa, templates Blade |
| **Calendar** | Calendly API v2 | Standard, fácil integración |
| **Hosting** | DigitalOcean / Forge | Infraestructura existente |

---

## 3. Estructura de Base de Datos

### Tablas Principales

```sql
-- Sesiones de chat
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id VARCHAR(255) UNIQUE NOT NULL, -- fingerprint/anonymous ID
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
    source_url VARCHAR(500),
    utm_data JSONB,
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    lead_score INTEGER, -- 0-100
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mensajes del chat
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role ENUM('user', 'assistant', 'system') NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB, -- intención detectada, tokens usados, etc.
    created_at TIMESTAMP DEFAULT NOW()
);

-- Leads calificados
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id),
    email VARCHAR(255),
    phone VARCHAR(50),
    company_name VARCHAR(255),
    industry VARCHAR(100),
    project_type ENUM('software', 'agent_ai', 'consulting', 'unknown'),
    problem_description TEXT,
    current_solution TEXT,
    timeline VARCHAR(50),
    budget_range VARCHAR(50),
    decision_maker BOOLEAN,
    complexity_score INTEGER, -- calculado por IA
    estimated_weeks_min INTEGER,
    estimated_weeks_max INTEGER,
    estimated_cost_min DECIMAL(10,2),
    estimated_cost_max DECIMAL(10,2),
    status ENUM('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost') DEFAULT 'new',
    assigned_to VARCHAR(255), -- email del responsable
    calendly_event_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Configuración del bot (para A/B testing)
CREATE TABLE bot_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    system_prompt TEXT NOT NULL,
    flow_config JSONB, -- estructura del flujo de preguntas
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Analytics y eventos
CREATE TABLE chat_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id),
    event_type VARCHAR(50) NOT NULL, -- 'flow_started', 'question_answered', 'estimation_shown', 'cta_clicked'
    event_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. API Endpoints

### Base URL: `/api/v1/chat`

#### Iniciar Sesión
```http
POST /sessions
Content-Type: application/json

{
  "visitor_id": "anon_123456",
  "source_url": "https://resolver.tech/servicios",
  "utm_data": {
    "source": "google",
    "campaign": "spring_2025"
  }
}

Response: 201 Created
{
  "session_id": "uuid",
  "welcome_message": "¡Hola! Soy Reso...",
  "quick_replies": [
    {"id": "software", "label": "Software a medida"},
    {"id": "agent", "label": "Agente IA"},
    {"id": "explore", "label": "Explorar opciones"}
  ]
}
```

#### Enviar Mensaje
```http
POST /sessions/{session_id}/messages
Content-Type: application/json

{
  "message": "Necesito una app para mi clínica dental",
  "context": {
    "current_step": "industry_discovery"
  }
}

Response: 200 OK
{
  "message_id": "uuid",
  "response": "Perfecto, el sector salud es uno de nuestros fuertes...",
  "quick_replies": [...],
  "collected_data": {
    "industry": "healthcare"
  },
  "next_step": "problem_description"
}
```

#### Obtener Estimación
```http
GET /sessions/{session_id}/estimate

Response: 200 OK
{
  "complexity": "medium",
  "score": 35,
  "estimated_weeks": {"min": 6, "max": 10},
  "estimated_cost": {"min": 8000, "max": 15000, "currency": "USD"},
  "factors": [
    "Integración con sistemas existentes",
    "Autenticación de usuarios requerida"
  ],
  "disclaimer": "Esta es una estimación preliminar basada en la información proporcionada..."
}
```

#### Generar Propuesta PDF
```http
POST /sessions/{session_id}/proposal
Content-Type: application/json

{
  "email": "cliente@ejemplo.com"
}

Response: 202 Accepted
{
  "proposal_id": "uuid",
  "download_url": "https://resolver.tech/proposals/uuid/download",
  "expires_at": "2025-03-10T00:00:00Z"
}
```

#### Agendar Meeting (Calendly)
```http
POST /sessions/{session_id}/schedule
Content-Type: application/json

{
  "event_type": "diagnostico_gratuito_30min",
  "suggested_times": ["2025-03-05T14:00:00Z", "2025-03-05T16:00:00Z"]
}

Response: 200 OK
{
  "calendly_link": "https://calendly.com/resolver/diagnostico/2025-03-05T14:00:00Z",
  "event_id": "cal_event_123"
}
```

---

## 5. Servicios Principales (Backend)

### ChatSessionService
```php
class ChatSessionService
{
    public function createSession(array $data): ChatSession;
    public function getSession(string $id): ChatSession;
    public function updateStatus(string $id, string $status): void;
    public function calculateLeadScore(string $sessionId): int;
}
```

### LLMService
```php
class LLMService
{
    public function generateResponse(
        array $conversationHistory,
        string $systemPrompt,
        array $tools = []
    ): LLMResponse;
    
    public function classifyIntent(string $message): Intent;
    public function extractEntities(string $message): array;
    public function analyzeComplexity(array $conversationData): ComplexityScore;
}
```

### EstimatorService
```php
class EstimatorService
{
    public function calculateEstimate(array $projectData): Estimate;
    public function getComparableProjects(string $industry, string $type): array;
    public function generateExplanation(Estimate $estimate): string;
}
```

### LeadQualificationService
```php
class LeadQualificationService
{
    public function qualifyFromConversation(string $sessionId): Lead;
    public function shouldEscalateToHuman(string $sessionId): bool;
    public function getRecommendedNextStep(string $sessionId): string;
}
```

### PDFGeneratorService
```php
class PDFGeneratorService
{
    public function generateProposal(string $sessionId, string $template = 'default'): PDFDocument;
    public function storeTemporarily(PDFDocument $pdf): string; // returns download URL
}
```

---

## 6. Frontend Widget

### Props del Componente
```typescript
interface ChatWidgetProps {
  apiEndpoint: string;
  position?: 'bottom-right' | 'bottom-left';
  primaryColor?: string;
  avatarUrl?: string;
  botName?: string;
  welcomeMessage?: string;
  showOnLoad?: boolean;
  delayBeforeShow?: number; // ms
  onLeadQualified?: (lead: Lead) => void;
  onMeetingScheduled?: (event: CalendlyEvent) => void;
}
```

### Estado Interno
```typescript
interface ChatState {
  sessionId: string | null;
  messages: Message[];
  isTyping: boolean;
  currentStep: string;
  collectedData: Record<string, any>;
  quickReplies: QuickReply[];
  isOpen: boolean;
  hasInteracted: boolean;
}
```

### Comportamiento
- Lazy loading: solo carga cuando usuario hace scroll o pasa X segundos
- Persistencia: guarda session_id en localStorage para retomar conversación
- Responsive: pantalla completa en mobile, sidebar en desktop
- Accesibilidad: WCAG 2.1 AA compliant

---

## 7. Flujo de Datos

```
1. Usuario abre widget
   → POST /sessions (crea sesión)
   → Retorna welcome_message + session_id

2. Usuario envía mensaje
   → POST /sessions/{id}/messages
   → Backend agrega a conversation_history
   → LLMService.generateResponse()
   → Guarda respuesta en DB
   → Retorna al frontend

3. Suficiente info recolectada
   → EstimatorService.calculateEstimate()
   → Guarda en leads table
   → Ofrece CTA (agendar/descargar)

4. Usuario agenda meeting
   → POST /sessions/{id}/schedule
   → Llama Calendly API
   → Actualiza lead con event_id
   → Notifica equipo por email

5. Usuario solicita PDF
   → POST /sessions/{id}/proposal
   → PDFGeneratorService.generateProposal()
   → Envía email con link
   → Almacena temporalmente
```

---

## 8. Seguridad

- Rate limiting: máximo 10 mensajes/minuto por IP
- Validación de inputs: sanitización de HTML en mensajes
- Autenticación: API key para endpoints internos
- CORS: permitir solo dominios de resolver.tech
- GDPR: consentimiento explícito para almacenar datos, opción de borrado
- No almacenar PII sin necesidad, anonimizar donde sea posible

---

## 9. Monitoreo y Logging

- Laravel Telescope para debugging
- Logs estructurados (JSON) para análisis
- Métricas clave:
  - Tiempo de respuesta del LLM
  - Tasa de éxito de generación de respuestas
  - Conversiones por paso del funnel
  - Errores y excepciones

---

## 10. Consideraciones de Escalabilidad

- Usar colas (Laravel Queue) para:
  - Generación de PDFs
  - Envío de emails
  - Análisis post-conversación
- Cachear prompts y configuraciones
- Conexiones persistentes a DB
- CDN para assets estáticos del widget

---

## 11. Plan de Implementación

### Semana 1: Fundamentos
- [ ] Setup proyecto Laravel
- [ ] Crear migraciones y modelos
- [ ] Implementar ChatSessionService básico
- [ ] Setup cuenta OpenRouter

### Semana 2: Core Backend
- [ ] Implementar LLMService con fallback
- [ ] Endpoints de sesiones y mensajes
- [ ] Lógica de flujo conversacional
- [ ] Tests unitarios

### Semana 3: Frontend y Deploy
- [ ] Desarrollar widget React
- [ ] Integración API-backend
- [ ] Diseño responsive
- [ ] Deploy a staging

### Semana 4: Features Avanzadas
- [ ] EstimatorService
- [ ] Integración Calendly
- [ ] Generación de PDFs
- [ ] Emails y notificaciones

### Semana 5: Testing y Optimización
- [ ] Testing end-to-end
- [ ] Ajuste de prompts
- [ ] Performance tuning
- [ ] Documentación

---

*Especificación sujeta a cambios según aprendizajes del desarrollo*
