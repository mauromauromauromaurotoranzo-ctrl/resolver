<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes - Resolver Chatbot
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'service' => 'resolver-chatbot-api']);
});

// Autenticación (público)
Route::prefix('v1/auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
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
    
    // Enviar resumen para cotización
    Route::post('/sessions/{sessionId}/quote', [ChatController::class, 'submitQuote']);
    
    // Generar propuesta PDF
    Route::post('/sessions/{sessionId}/proposal', [ChatController::class, 'generateProposal']);
    
    // Agendar meeting
    Route::post('/sessions/{sessionId}/schedule', [ChatController::class, 'scheduleMeeting']);
});

// Admin routes (protegidas)
Route::prefix('v1/admin')->middleware(['auth:sanctum'])->group(function () {
    
    // Leads
    Route::get('/leads', [AdminController::class, 'listLeads']);
    Route::get('/leads/{id}', [AdminController::class, 'getLead']);
    Route::put('/leads/{id}', [AdminController::class, 'updateLead']);
    
    // Stats
    Route::get('/stats', [AdminController::class, 'getStats']);
    
    // Bot configuration
    Route::get('/configurations', [AdminController::class, 'listConfigurations']);
    Route::get('/configurations/active', [AdminController::class, 'getActiveConfiguration']);
    Route::post('/configurations', [AdminController::class, 'createConfiguration']);
    Route::put('/configurations/{id}', [AdminController::class, 'updateConfiguration']);
    Route::post('/configurations/{id}/activate', [AdminController::class, 'activateConfiguration']);
    
    // Active sessions
    Route::get('/sessions/active', [AdminController::class, 'getActiveSessions']);
});
