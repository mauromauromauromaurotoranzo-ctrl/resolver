<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\BotConfiguration;

class LLMService
{
    private string $apiKey;
    private string $baseUrl = 'https://openrouter.ai/api/v1';
    private string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.key');
        $this->model = $this->resolveDefaultModel();
    }

    /**
     * Genera una respuesta basada en el historial de conversación
     */
    public function generateResponse(array $conversationHistory, string $systemPrompt): array
    {
        try {
            $messages = array_merge(
                [['role' => 'system', 'content' => $systemPrompt]],
                $conversationHistory
            );

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => 'Resolver Chatbot',
            ])->post($this->baseUrl . '/chat/completions', [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => 0.7,
                // Reducimos max_tokens para evitar errores 402 de créditos insuficientes
                'max_tokens' => 256,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'success' => true,
                    'content' => $data['choices'][0]['message']['content'],
                    'tokens_used' => $data['usage']['total_tokens'] ?? null,
                    'model' => $data['model'] ?? $this->model,
                ];
            }

            Log::error('OpenRouter API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Si es error de créditos (402), devolvemos un mensaje más amigable
            if ($response->status() === 402) {
                return [
                    'success' => false,
                    'content' => 'En este momento tengo un límite de uso del modelo de IA y no puedo generar una respuesta completa. Podés igual dejar tus datos con el botón "Enviar y Cotizar" así te contactamos con una propuesta.',
                    'fallback' => true,
                ];
            }

            return $this->fallbackResponse();

        } catch (\Exception $e) {
            Log::error('LLM Service error: ' . $e->getMessage());
            return $this->fallbackResponse();
        }
    }

    /**
     * Clasifica la intención del mensaje del usuario
     */
    public function classifyIntent(string $message): string
    {
        $prompt = "Clasifica la intención de este mensaje en una de estas categorías: 
        - software_request (quiere desarrollar software)
        - agent_request (quiere un agente IA)
        - pricing_inquiry (pregunta sobre precios)
        - process_question (pregunta cómo trabajamos)
        - objection (tiene dudas/objeciones)
        - other (otro tema)
        
        Responde SOLO con la categoría, sin explicaciones.
        
        Mensaje: \"{$message}\"";

        $result = $this->generateResponse([], $prompt);
        
        if ($result['success']) {
            $intent = trim(strtolower($result['content']));
            return in_array($intent, [
                'software_request', 'agent_request', 'pricing_inquiry',
                'process_question', 'objection'
            ]) ? $intent : 'other';
        }

        return 'other';
    }

    /**
     * Extrae entidades clave del mensaje
     */
    public function extractEntities(string $message): array
    {
        $prompt = "Extrae información estructurada de este mensaje en formato JSON:
        {
            \"industry\": \"sector/industria mencionado o null\",
            \"problem\": \"problema a resolver o null\",
            \"urgency\": \"alta/media/baja/null\",
            \"budget_hint\": \"si menciona presupuesto, resumir o null\"
        }
        
        Responde SOLO el JSON, sin markdown ni explicaciones.
        
        Mensaje: \"{$message}\"";

        $result = $this->generateResponse([], $prompt);
        
        if ($result['success']) {
            try {
                $json = json_decode($result['content'], true);
                return is_array($json) ? $json : [];
            } catch (\Exception $e) {
                return [];
            }
        }

        return [];
    }

    /**
     * Resuelve el modelo por defecto usando la configuración activa del bot
     * y, si no existe, el valor de configuración/env.
     */
    private function resolveDefaultModel(): string
    {
        try {
            $activeConfig = BotConfiguration::where('is_active', true)->first();

            if ($activeConfig && !empty($activeConfig->default_model)) {
                return $activeConfig->default_model;
            }
        } catch (\Exception $e) {
            Log::warning('LLMService: error leyendo configuración activa de bot', [
                'message' => $e->getMessage(),
            ]);
        }

        return config('services.openrouter.model', 'anthropic/claude-3.5-sonnet');
    }

    /**
     * Respuesta fallback cuando la API falla
     */
    private function fallbackResponse(): array
    {
        return [
            'success' => false,
            'content' => 'Disculpá, estoy teniendo problemas técnicos. ¿Te parece si me escribís a hola@resolver.tech y te contactamos directamente?',
            'fallback' => true,
        ];
    }
}
