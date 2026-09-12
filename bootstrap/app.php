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
    
    @mkdir('/tmp/framework/views', 0777, true);
    @mkdir('/tmp/framework/sessions', 0777, true);
    @mkdir('/tmp/framework/cache/data', 0777, true);
    @touch('/tmp/database.sqlite');
    
    $app->useEnvironmentPath(__DIR__.'/../');
    $app->loadEnvironmentFrom('.env.vercel');
}

return $app;
