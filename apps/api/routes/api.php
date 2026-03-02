<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Resolver Chatbot
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'resolver-chatbot-api']);
});

// Chat sessions (público)
Route::prefix('v1/chat')->group(function () {
    
    // Iniciar nueva sesión
    Route::post('/sessions', [ChatController::class, 'createSession']);
    
    // Enviar mensaje
    Route::post('/sessions/{sessionId}/messages', [ChatController::class, 'sendMessage']);
    
    // Obtener historial de sesión
    Route::get('/sessions/{sessionId}', [ChatController::class, 'getSession']);
    
    // Obtener estimación
    Route::get('/sessions/{sessionId}/estimate', [ChatController::class, 'getEstimate']);
    
    // Generar propuesta PDF
    Route::post('/sessions/{sessionId}/proposal', [ChatController::class, 'generateProposal']);
    
    // Agendar meeting
    Route::post('/sessions/{sessionId}/schedule', [ChatController::class, 'scheduleMeeting']);
});

// Admin routes (protegidas)
Route::prefix('v1/admin')->middleware(['auth:sanctum'])->group(function () {
    
    // Leads
    Route::get('/leads', [LeadController::class, 'index']);
    Route::get('/leads/{id}', [LeadController::class, 'show']);
    Route::put('/leads/{id}', [LeadController::class, 'update']);
    Route::delete('/leads/{id}', [LeadController::class, 'destroy']);
    
    // Bot configuration
    Route::get('/config', [AdminController::class, 'getConfig']);
    Route::put('/config', [AdminController::class, 'updateConfig']);
    
    // Analytics
    Route::get('/analytics/overview', [AdminController::class, 'getOverview']);
    Route::get('/analytics/conversions', [AdminController::class, 'getConversions']);
});
