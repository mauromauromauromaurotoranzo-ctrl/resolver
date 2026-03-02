# Chatbot Widget

Widget embebible de React para Resolver Assistant.

## Características

- ✅ Múltiples modelos de LLM configurables
- ✅ TypeScript + Vite
- ✅ Tailwind CSS
- ✅ Responsive y accesible
- ✅ Persistencia de sesión
- ✅ Quick replies
- ✅ Typing indicator
- ✅ Animaciones suaves

## Setup

```bash
cd apps/chatbot-widget
npm install
npm run dev
```

## Build para producción

```bash
npm run build
```

Genera `dist/` con los archivos listos para CDN.

## Uso en Landing

```html
<!-- Incluir el script -->
<script src="https://tu-cdn.com/resolver-chat-widget.js"></script>

<!-- Inicializar -->
<script>
  ResolverChat.init({
    apiEndpoint: 'https://api.resolver.tech/v1',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    botName: 'Resolver Assistant'
  });
</script>
```

## Configuración de Modelos

El widget soporta múltiples modelos de LLM que se configuran desde el backend:

- `gpt-4` - OpenAI GPT-4
- `claude-3.5-sonnet` - Anthropic Claude
- `gemini-pro` - Google Gemini
- `llama-3.1` - Meta Llama (vía OpenRouter)

El modelo se selecciona automáticamente según:
1. Configuración del admin en backoffice
2. Disponibilidad del servicio
3. Complejidad de la consulta
