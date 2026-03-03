<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Models\ChatMessage;
use App\Models\Lead;
use App\Services\LLMService;
use App\Services\EstimatorService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    private LLMService $llmService;
    private EstimatorService $estimatorService;

    public function __construct(LLMService $llmService, EstimatorService $estimatorService)
    {
        $this->llmService = $llmService;
        $this->estimatorService = $estimatorService;
    }

    /**
     * Inicia una nueva sesión de chat
     */
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'source_url' => 'nullable|string|max:500',
            'utm_data' => 'nullable|array',
        ]);

        $visitorId = $request->header('X-Visitor-ID') ?: Str::uuid()->toString();

        $session = ChatSession::create([
            'id' => Str::uuid()->toString(),
            'visitor_id' => $visitorId,
            'status' => 'active',
            'source_url' => $validated['source_url'] ?? null,
            'utm_data' => $validated['utm_data'] ?? null,
        ]);

        // Mensaje inicial del sistema
        $welcomeMessage = $this->getWelcomeMessage();

        ChatMessage::create([
            'id' => Str::uuid()->toString(),
            'session_id' => $session->id,
            'role' => 'assistant',
            'content' => $welcomeMessage['text'],
            'metadata' => ['type' => 'welcome', 'quick_replies' => $welcomeMessage['quick_replies']],
        ]);

        return response()->json([
            'session_id' => $session->id,
            'visitor_id' => $visitorId,
            'welcome_message' => $welcomeMessage['text'],
            'quick_replies' => $welcomeMessage['quick_replies'],
        ], 201);
    }

    /**
     * Procesa un mensaje del usuario y genera respuesta
     */
    public function sendMessage(Request $request, string $sessionId)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $session = ChatSession::findOrFail($sessionId);

        if ($session->status !== 'active') {
            return response()->json(['error' => 'Session expired'], 410);
        }

        // Guardar mensaje del usuario
        ChatMessage::create([
            'id' => Str::uuid()->toString(),
            'session_id' => $session->id,
            'role' => 'user',
            'content' => $validated['message'],
        ]);

        // Obtener historial de conversación
        $history = $this->getConversationHistory($session);

        // Cargar system prompt
        $systemPrompt = $this->loadSystemPrompt();

        // Generar respuesta con LLM
        $llmResponse = $this->llmService->generateResponse($history, $systemPrompt);

        // Extraer metadata si es posible
        $metadata = [];
        if ($llmResponse['success']) {
            $intent = $this->llmService->classifyIntent($validated['message']);
            $entities = $this->llmService->extractEntities($validated['message']);
            $metadata = [
                'intent' => $intent,
                'entities' => $entities,
                'tokens_used' => $llmResponse['tokens_used'] ?? null,
            ];

            // Actualizar datos recolectados en la sesión
            $this->updateCollectedData($session, $entities);
        }

        // Guardar respuesta del asistente
        $assistantMessage = ChatMessage::create([
            'id' => Str::uuid()->toString(),
            'session_id' => $session->id,
            'role' => 'assistant',
            'content' => $llmResponse['content'],
            'metadata' => $metadata,
        ]);

        // Determinar siguiente paso y quick replies
        $nextStep = $this->determineNextStep($session);
        $quickReplies = $this->getQuickRepliesForStep($nextStep);

        return response()->json([
            'message_id' => $assistantMessage->id,
            'response' => $llmResponse['content'],
            'quick_replies' => $quickReplies,
            'collected_data' => $session->collected_data,
            'next_step' => $nextStep,
            'fallback' => $llmResponse['fallback'] ?? false,
        ]);
    }

    /**
     * Envía resumen del proyecto para cotización
     */
    public function submitQuote(Request $request, string $sessionId)
    {
        $validated = $request->validate([
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'contact_name' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:255',
        ]);

        $session = ChatSession::findOrFail($sessionId);

        if ($session->status !== 'active') {
            return response()->json(['error' => 'Session expired'], 410);
        }

        // Generar resumen de la conversación
        $conversationSummary = $this->generateConversationSummary($session);
        
        // Obtener datos recolectados
        $collectedData = $session->collected_data ?? [];
        
        // Mapear project_type desde collected_data
        $projectType = 'unknown';
        if (!empty($collectedData['project_type'])) {
            $typeMap = [
                'web_app' => 'software',
                'mobile_app' => 'software',
                'automation' => 'agent_ai',
                'other' => 'unknown',
            ];
            $projectType = $typeMap[$collectedData['project_type']] ?? 'unknown';
        }

        // Crear o actualizar lead
        $lead = Lead::firstOrNew(['session_id' => $session->id]);
        
        if (!$lead->exists) {
            $lead->id = Str::uuid()->toString();
        }
        
        $lead->email = $validated['email'] ?? $lead->email;
        $lead->phone = $validated['phone'] ?? $lead->phone;
        $lead->contact_name = $validated['contact_name'] ?? $lead->contact_name;
        $lead->company_name = $validated['company_name'] ?? $lead->company_name;
        $lead->industry = $collectedData['industry'] ?? $lead->industry;
        $lead->project_type = $projectType;
        $lead->problem_description = $conversationSummary;
        $lead->current_solution = $collectedData['current_solution'] ?? $lead->current_solution;
        $lead->timeline = $collectedData['timeline'] ?? $lead->timeline;
        $lead->budget_range = $collectedData['budget_range'] ?? $lead->budget_range;
        $lead->status = 'new';
        $lead->save();

        // Marcar sesión como completada
        $session->status = 'completed';
        $session->ended_at = now();
        $session->save();

        return response()->json([
            'success' => true,
            'lead_id' => $lead->id,
            'message' => 'Tu solicitud de cotización ha sido enviada. Nos pondremos en contacto contigo pronto.',
        ], 201);
    }

    /**
     * Genera un resumen de la conversación
     */
    private function generateConversationSummary(ChatSession $session): string
    {
        $messages = ChatMessage::where('session_id', $session->id)
            ->where('role', '!=', 'system')
            ->orderBy('created_at')
            ->get();

        $summary = "Resumen de la conversación:\n\n";
        
        foreach ($messages as $msg) {
            $role = $msg->role === 'user' ? 'Usuario' : 'Asistente';
            $summary .= "{$role}: {$msg->content}\n\n";
        }

        $collectedData = $session->collected_data ?? [];
        if (!empty($collectedData)) {
            $summary .= "\nDatos recolectados:\n";
            foreach ($collectedData as $key => $value) {
                if (!empty($value)) {
                    $summary .= "- " . ucfirst(str_replace('_', ' ', $key)) . ": {$value}\n";
                }
            }
        }

        return $summary;
    }

    /**
     * Genera estimación del proyecto
     */
    public function getEstimate(string $sessionId)
    {
        $session = ChatSession::findOrFail($sessionId);
        
        if (empty($session->collected_data)) {
            return response()->json(['error' => 'Insufficient data'], 400);
        }

        $estimate = $this->estimatorService->calculateEstimate($session->collected_data);
        
        // Crear o actualizar lead
        $lead = Lead::updateOrCreate(
            ['session_id' => $session->id],
            [
                'complexity_score' => $estimate['score'],
                'estimated_weeks_min' => $estimate['estimated_weeks']['min'],
                'estimated_weeks_max' => $estimate['estimated_weeks']['max'],
                'estimated_cost_min' => $estimate['estimated_cost']['min'],
                'estimated_cost_max' => $estimate['estimated_cost']['max'],
                'project_data' => $session->collected_data,
                'status' => 'new',
            ]
        );

        // Notificar al equipo (async)
        // TODO: Implementar job de notificación

        return response()->json([
            'estimate' => $estimate,
            'lead_id' => $lead->id,
            'explanation' => $this->estimatorService->generateExplanation($estimate),
        ]);
    }

    /**
     * Obtiene historial de conversación formateado para LLM
     */
    private function getConversationHistory(ChatSession $session): array
    {
        $messages = ChatMessage::where('session_id', $session->id)
            ->orderBy('created_at')
            ->get();

        return $messages->map(function ($msg) {
            return [
                'role' => $msg->role,
                'content' => $msg->content,
            ];
        })->toArray();
    }

    /**
     * Carga el system prompt desde archivo o config
     */
    private function loadSystemPrompt(): string
    {
        $promptPath = base_path('prompts/system_prompt_v1.md');
        
        if (file_exists($promptPath)) {
            return file_get_contents($promptPath);
        }

        // Fallback básico
        return "Eres Resolver Assistant, el asistente virtual de Resolver.tech. ";
    }

    /**
     * Mensaje de bienvenida inicial
     */
    private function getWelcomeMessage(): array
    {
        return [
            'text' => "¡Hola! Soy el **Resolver Assistant**. 👋\n\nEstoy acá para ayudarte a planificar tu proyecto. En Resolver desarrollamos software y agentes IA potenciados por inteligencia artificial — más rápido y a mejor costo.\n\n¿Qué tipo de solución estás buscando?",
            'quick_replies' => [
                ['id' => 'software', 'label' => '🚀 Software a medida'],
                ['id' => 'agent', 'label' => '🤖 Agente IA'],
                ['id' => 'explore', 'label' => '💡 Explorar opciones'],
            ],
        ];
    }

    /**
     * Actualiza datos recolectados de la sesión
     */
    private function updateCollectedData(ChatSession $session, array $entities): void
    {
        $data = $session->collected_data ?? [];
        
        if (!empty($entities['industry'])) {
            $data['industry'] = $entities['industry'];
        }
        if (!empty($entities['problem'])) {
            $data['problem_description'] = $entities['problem'];
        }
        if (!empty($entities['urgency'])) {
            $data['timeline'] = $entities['urgency'];
        }
        
        $session->collected_data = $data;
        $session->save();
    }

    /**
     * Determina el siguiente paso del flujo
     */
    private function determineNextStep(ChatSession $session): string
    {
        $data = $session->collected_data ?? [];
        
        if (empty($data['project_type'])) {
            return 'project_type';
        }
        if (empty($data['industry'])) {
            return 'industry';
        }
        if (empty($data['problem_description'])) {
            return 'problem_description';
        }
        if (empty($data['current_solution'])) {
            return 'current_solution';
        }
        if (empty($data['timeline'])) {
            return 'timeline';
        }
        if (empty($data['budget_range'])) {
            return 'budget_range';
        }
        
        return 'estimation_ready';
    }

    /**
     * Obtiene quick replies según el paso
     */
    private function getQuickRepliesForStep(string $step): array
    {
        // Nota:
        // - La intención de "tipo de solución" (web, app móvil, automatización IA, etc.)
        //   ya se pregunta en el mensaje de bienvenida inicial.
        // - Para evitar que esa misma pregunta con quick replies se repita
        //   después de cada respuesta del asistente, NO devolvemos más
        //   quick replies específicos para el paso "project_type".
        $replies = [
            'project_type' => [
                // Sin quick replies aquí para no repetir la pregunta inicial
            ],
            'industry' => [
                ['id' => 'healthcare', 'label' => 'Salud'],
                ['id' => 'fintech', 'label' => 'Finanzas'],
                ['id' => 'ecommerce', 'label' => 'E-commerce'],
                ['id' => 'education', 'label' => 'Educación'],
                ['id' => 'other', 'label' => 'Otra'],
            ],
            'timeline' => [
                ['id' => 'asap', 'label' => 'Lo antes posible'],
                ['id' => '1_month', 'label' => 'En 1 mes'],
                ['id' => '3_months', 'label' => 'En 3 meses'],
                ['id' => 'flexible', 'label' => 'Flexible'],
            ],
            'budget_range' => [
                ['id' => '5k_10k', 'label' => '$5K - $10K'],
                ['id' => '10k_25k', 'label' => '$10K - $25K'],
                ['id' => '25k_50k', 'label' => '$25K - $50K'],
                ['id' => '50k_plus', 'label' => '$50K+'],
                ['id' => 'not_sure', 'label' => 'No estoy seguro'],
            ],
            'estimation_ready' => [
                ['id' => 'get_estimate', 'label' => '📊 Ver estimación'],
                ['id' => 'add_details', 'label' => '➕ Agregar detalles'],
                ['id' => 'talk_human', 'label' => '👨‍💼 Hablar con alguien'],
            ],
        ];

        return $replies[$step] ?? [];
    }
}
