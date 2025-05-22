<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [App\Http\Controllers\Auth\LoginController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware(['verified'])
->prefix('web')
->group(function () {
    Route::apiResource('categorias', App\Http\Controllers\Api\CategoriasController::class);
    Route::apiResource('comentarios', App\Http\Controllers\Api\ComentariosController::class);
    Route::apiResource('comercios', App\Http\Controllers\Api\ComerciosController::class);
    Route::apiResource('horarios', App\Http\Controllers\Api\HorariosController::class);
    Route::apiResource('localidades', App\Http\Controllers\Api\LocalidadesController::class);
    Route::apiResource('productos', App\Http\Controllers\Api\ProductosController::class);
    Route::apiResource('redes', App\Http\Controllers\Api\RedesSocialesController::class);
    Route::apiResource('tipos_dieta', App\Http\Controllers\Api\TiposDietaController::class);
});

Route::middleware(['auth:sanctum', 'verified'])
->group(function () {
    
    Route::prefix('comercios')
    ->group(function () {
        Route::get('/localidad/{id}', [App\Http\Controllers\Api\ComerciosController::class, 'localidad']);
    });
    
    Route::prefix('comentarios')
    ->group(function () {
        Route::post('/', [App\Http\Controllers\Api\ComentariosController::class, 'store']);
    });
});