<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\ChatSession;
use App\Models\BotConfiguration;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Listar todos los leads con filtros
     */
    public function listLeads(Request $request)
    {
        $query = Lead::with('session');

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('industry')) {
            $query->where('project_data->industry', $request->industry);
        }
        if ($request->has('min_budget')) {
            $query->where('estimated_cost_max', '>=', $request->min_budget);
        }
        if ($request->has('assigned_to')) {
            $query->where('assigned_to', $request->assigned_to);
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginación
        $perPage = $request->get('per_page', 20);
        $leads = $query->paginate($perPage);

        return response()->json([
            'data' => $leads->items(),
            'pagination' => [
                'current_page' => $leads->currentPage(),
                'total_pages' => $leads->lastPage(),
                'total_items' => $leads->total(),
                'per_page' => $leads->perPage(),
            ],
        ]);
    }

    /**
     * Obtener detalle de un lead
     */
    public function getLead(string $id)
    {
        $lead = Lead::with(['session', 'session.messages'])->findOrFail($id);

        return response()->json([
            'lead' => $lead,
            'conversation' => $lead->session->messages ?? [],
        ]);
    }

    /**
     * Actualizar estado de un lead
     */
    public function updateLead(Request $request, string $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,qualified,proposal_sent,won,lost',
            'assigned_to' => 'nullable|string|email',
            'notes' => 'nullable|string',
            'internal_notes' => 'nullable|string',
        ]);

        $lead = Lead::findOrFail($id);
        $lead->update($validated);

        return response()->json([
            'message' => 'Lead updated successfully',
            'lead' => $lead,
        ]);
    }

    /**
     * Estadísticas del dashboard
     */
    public function getStats()
    {
        $stats = [
            'total_leads' => Lead::count(),
            'new_leads_this_week' => Lead::where('created_at', '>=', now()->subWeek())->count(),
            'leads_by_status' => Lead::selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status'),
            'avg_project_value' => Lead::avg('estimated_cost_max'),
            'conversion_rate' => $this->calculateConversionRate(),
            'top_industries' => Lead::selectRaw("project_data->>'industry' as industry, count(*) as count")
                ->groupBy('industry')
                ->orderByDesc('count')
                ->limit(5)
                ->pluck('count', 'industry'),
        ];

        return response()->json($stats);
    }

    /**
     * Listar configuraciones del bot
     */
    public function listConfigurations()
    {
        $configs = BotConfiguration::orderBy('created_at', 'desc')->get();

        return response()->json($configs);
    }

    /**
     * Crear nueva configuración del bot
     */
    public function createConfiguration(Request $request)
    {
        $data = $request->all();

        // Aceptar tanto camelCase (frontend) como snake_case (backend)
        if (isset($data['systemPrompt']) && !isset($data['system_prompt'])) {
            $data['system_prompt'] = $data['systemPrompt'];
        }
        if (isset($data['defaultModel']) && !isset($data['default_model'])) {
            $data['default_model'] = $data['defaultModel'];
        }

        $validated = validator($data, [
            'name' => 'required|string|max:100',
            'system_prompt' => 'required|string',
            'default_model' => 'nullable|string|max:255',
            'flow_config' => 'nullable|array',
            'is_active' => 'boolean',
        ])->validate();

        // Si se activa esta config, desactivar las demás
        if ($validated['is_active'] ?? false) {
            BotConfiguration::where('is_active', true)->update(['is_active' => false]);
        }

        $config = BotConfiguration::create([
            ...$validated,
            'version' => $this->generateVersion(),
        ]);

        return response()->json($config, 201);
    }

    /**
     * Actualizar configuración del bot
     */
    public function updateConfiguration(Request $request, string $id)
    {
        $data = $request->all();

        if (isset($data['systemPrompt']) && !isset($data['system_prompt'])) {
            $data['system_prompt'] = $data['systemPrompt'];
        }
        if (isset($data['defaultModel']) && !isset($data['default_model'])) {
            $data['default_model'] = $data['defaultModel'];
        }

        $validated = validator($data, [
            'name' => 'string|max:100',
            'system_prompt' => 'string',
            'default_model' => 'nullable|string|max:255',
            'flow_config' => 'array',
            'is_active' => 'boolean',
        ])->validate();

        $config = BotConfiguration::findOrFail($id);

        // Si se activa esta config, desactivar las demás
        if (($validated['is_active'] ?? false) && !$config->is_active) {
            BotConfiguration::where('is_active', true)->update(['is_active' => false]);
        }

        $config->update($validated);

        return response()->json($config);
    }

    /**
     * Activar/desactivar configuración
     */
    public function activateConfiguration(string $id)
    {
        // Desactivar todas primero
        BotConfiguration::where('is_active', true)->update(['is_active' => false]);

        // Activar la seleccionada
        $config = BotConfiguration::findOrFail($id);
        $config->update(['is_active' => true]);

        return response()->json([
            'message' => 'Configuration activated',
            'config' => $config,
        ]);
    }

    /**
     * Obtener configuración activa
     */
    public function getActiveConfiguration()
    {
        $config = BotConfiguration::where('is_active', true)->first();

        if (!$config) {
            return response()->json(['error' => 'No active configuration'], 404);
        }

        return response()->json($config);
    }

    /**
     * Sesiones activas en tiempo real
     */
    public function getActiveSessions()
    {
        $sessions = ChatSession::where('status', 'active')
            ->where('updated_at', '>=', now()->subMinutes(30))
            ->withCount('messages')
            ->orderByDesc('updated_at')
            ->limit(50)
            ->get();

        return response()->json($sessions);
    }

    /**
     * Calcular tasa de conversión
     */
    private function calculateConversionRate(): float
    {
        $total = Lead::count();
        
        if ($total === 0) {
            return 0.0;
        }

        $won = Lead::where('status', 'won')->count();
        
        return round(($won / $total) * 100, 2);
    }

    /**
     * Generar versión incremental
     */
    private function generateVersion(): string
    {
        $lastConfig = BotConfiguration::orderByDesc('created_at')->first();
        
        if (!$lastConfig) {
            return '1.0.0';
        }

        $parts = explode('.', $lastConfig->version);
        $parts[2] = (int) $parts[2] + 1;
        
        return implode('.', $parts);
    }
}
