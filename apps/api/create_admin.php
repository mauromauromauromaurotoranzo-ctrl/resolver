<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;

$user = User::where('email', 'admin@resolver.tech')->first();

if ($user) {
    $user->password = bcrypt('admin123');
    $user->save();
    echo "✅ Contraseña actualizada para admin@resolver.tech\n";
    echo "Email: admin@resolver.tech\n";
    echo "Password: admin123\n";
} else {
    $user = User::create([
        'name' => 'Admin',
        'email' => 'admin@resolver.tech',
        'password' => bcrypt('admin123'),
    ]);
    echo "✅ Usuario creado:\n";
    echo "Email: admin@resolver.tech\n";
    echo "Password: admin123\n";
}
