<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

try {
    $user = User::where('email', 'admin@resolver.tech')->first();
    
    if (!$user) {
        echo "❌ Usuario no encontrado\n";
        exit(1);
    }
    
    echo "✅ Usuario encontrado: {$user->email}\n";
    echo "✅ Password hash existe: " . (empty($user->password) ? 'NO' : 'SÍ') . "\n";
    
    // Probar crear token
    try {
        $token = $user->createToken('test-token')->plainTextToken;
        echo "✅ Token creado exitosamente\n";
        echo "Token: " . substr($token, 0, 20) . "...\n";
    } catch (\Exception $e) {
        echo "❌ Error al crear token: " . $e->getMessage() . "\n";
        echo "Tipo: " . get_class($e) . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Tipo: " . get_class($e) . "\n";
    echo "Archivo: " . $e->getFile() . ":" . $e->getLine() . "\n";
}
