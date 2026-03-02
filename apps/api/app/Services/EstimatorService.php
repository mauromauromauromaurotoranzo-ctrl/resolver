<?php

namespace App\Services;

class EstimatorService
{
    /**
     * Factores de complejidad por tipo de proyecto
     */
    private array $complexityFactors = [
        'simple' => [
            'base_score' => 10,
            'weeks_min' => 2,
            'weeks_max' => 4,
            'cost_min' => 3000,
            'cost_max' => 6000,
        ],
        'moderate' => [
            'base_score' => 25,
            'weeks_min' => 4,
            'weeks_max' => 8,
            'cost_min' => 6000,
            'cost_max' => 15000,
        ],
        'complex' => [
            'base_score' => 50,
            'weeks_min' => 8,
            'weeks_max' => 16,
            'cost_min' => 15000,
            'cost_max' => 35000,
        ],
        'enterprise' => [
            'base_score' => 80,
            'weeks_min' => 16,
            'weeks_max' => 24,
            'cost_min' => 35000,
            'cost_max' => 80000,
        ],
    ];

    /**
     * Multiplicadores por características adicionales
     */
    private array $multipliers = [
        'integrations' => 1.2,        // Cada integración externa
        'auth_complex' => 1.3,        // Auth multi-rol, SSO, etc.
        'realtime' => 1.4,            // WebSockets, tiempo real
        'payment' => 1.3,             // Pasarelas de pago
        'ai_features' => 1.5,         // Features con IA generativa
        'mobile_app' => 1.6,          // App móvil nativa o PWA compleja
        'compliance' => 1.4,          // HIPAA, GDPR, SOC2, etc.
        'legacy_integration' => 1.5,  // Integrar con sistemas legacy
    ];

    /**
     * Calcula estimación basada en datos recolectados
     */
    public function calculateEstimate(array $projectData): array
    {
        $score = $this->calculateBaseScore($projectData);
        $complexity = $this->determineComplexity($score);
        $factors = $this->getRelevantFactors($projectData);
        
        $base = $this->complexityFactors[$complexity];
        $multiplier = $this->calculateMultiplier($factors);
        
        return [
            'complexity' => $complexity,
            'score' => $score,
            'estimated_weeks' => [
                'min' => round($base['weeks_min'] * $multiplier),
                'max' => round($base['weeks_max'] * $multiplier),
            ],
            'estimated_cost' => [
                'min' => round($base['cost_min'] * $multiplier, -2), // Redondear a centenas
                'max' => round($base['cost_max'] * $multiplier, -2),
                'currency' => 'USD',
            ],
            'factors' => $factors,
            'disclaimer' => 'Esta es una estimación preliminar basada en la información proporcionada. Una propuesta formal requiere un diagnóstico detallado.',
        ];
    }

    /**
     * Calcula score base según descripción del proyecto
     */
    private function calculateBaseScore(array $data): int
    {
        $score = 0;
        
        // Tamaño del equipo impactado
        $teamSize = $data['team_size'] ?? 1;
        $score += match(true) {
            $teamSize <= 5 => 5,
            $teamSize <= 20 => 10,
            $teamSize <= 100 => 20,
            default => 30,
        };
        
        // Complejidad percibida (si viene definida)
        if (isset($data['complexity_indicators'])) {
            foreach ($data['complexity_indicators'] as $indicator) {
                $score += match($indicator) {
                    'simple_crud' => 5,
                    'workflows' => 15,
                    'integrations' => 20,
                    'realtime' => 25,
                    'ml_ai' => 30,
                    'high_scale' => 35,
                    default => 10,
                };
            }
        }
        
        // Urgencia (timeline apretado = más costo)
        $timeline = $data['timeline'] ?? 'normal';
        if ($timeline === 'urgent') {
            $score *= 1.3;
        }
        
        return min((int) $score, 100);
    }

    /**
     * Determina nivel de complejidad según score
     */
    private function determineComplexity(int $score): string
    {
        return match(true) {
            $score < 20 => 'simple',
            $score < 45 => 'moderate',
            $score < 75 => 'complex',
            default => 'enterprise',
        };
    }

    /**
     * Obtiene factores relevantes del proyecto
     */
    private function getRelevantFactors(array $data): array
    {
        $factors = [];
        
        $descriptions = [
            'integrations' => ['integración', 'API', 'conectar', 'sincronizar', 'webhook'],
            'auth_complex' => ['roles', 'permisos', 'SSO', 'LDAP', 'autenticación'],
            'realtime' => ['tiempo real', 'websocket', 'notificaciones instantáneas', 'chat'],
            'payment' => ['pago', 'stripe', 'mercadopago', 'checkout', 'suscripción'],
            'ai_features' => ['IA', 'inteligencia artificial', 'machine learning', 'NLP', 'generativo'],
            'mobile_app' => ['app móvil', 'iOS', 'Android', 'React Native', 'Flutter'],
            'compliance' => ['HIPAA', 'GDPR', 'SOC2', 'compliance', 'regulación'],
            'legacy_integration' => ['sistema viejo', 'legacy', 'migrar', 'AS400', 'mainframe'],
        ];
        
        $problemText = strtolower($data['problem_description'] ?? '');
        
        foreach ($descriptions as $factor => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($problemText, $keyword)) {
                    $factors[] = $factor;
                    break;
                }
            }
        }
        
        return array_unique($factors);
    }

    /**
     * Calcula multiplicador total según factores
     */
    private function calculateMultiplier(array $factors): float
    {
        $multiplier = 1.0;
        
        foreach ($factors as $factor) {
            if (isset($this->multipliers[$factor])) {
                $multiplier += ($this->multipliers[$factor] - 1);
            }
        }
        
        // Cap en 2.5x para evitar estimaciones locas
        return min($multiplier, 2.5);
    }

    /**
     * Genera explicación legible de la estimación
     */
    public function generateExplanation(array $estimate): string
    {
        $complexityLabels = [
            'simple' => 'baja complejidad',
            'moderate' => 'complejidad media',
            'complex' => 'alta complejidad',
            'enterprise' => 'complejidad enterprise',
        ];
        
        $explanation = "Basado en lo que me contás, esto parece un proyecto de {$complexityLabels[$estimate['complexity']]}";
        
        if (!empty($estimate['factors'])) {
            $factorCount = count($estimate['factors']);
            $explanation .= ". Detecté {$factorCount} factor" . ($factorCount > 1 ? 'es' : '') . " que puede aumentar el alcance:";
        }
        
        return $explanation;
    }
}
