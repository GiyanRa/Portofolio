<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

if (isset($_ENV['VERCEL']) || isset($_SERVER['VERCEL'])) {
    $app->useStoragePath('/tmp');
    
    // Pastikan folder-folder yang dibutuhkan Laravel ada di /tmp
    @mkdir('/tmp/framework/views', 0777, true);
    @mkdir('/tmp/framework/sessions', 0777, true);
    @mkdir('/tmp/framework/cache/data', 0777, true);
    
    // Override pengaturan bawaan agar sesuai dengan serverless
    $_ENV['SESSION_DRIVER'] = 'file';
    $_ENV['CACHE_STORE'] = 'file';
    $_ENV['DB_CONNECTION'] = 'sqlite';
    $_ENV['DB_DATABASE'] = '/tmp/database.sqlite';
    @touch('/tmp/database.sqlite');
}

return $app;
