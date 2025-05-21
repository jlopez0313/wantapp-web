<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware(['web', 'verified'])
->prefix('web')
->group(function () {
    Route::apiResource('categorias', App\Http\Controllers\Api\CategoriasController::class);
    Route::apiResource('comercios', App\Http\Controllers\Api\ComerciosController::class);
    Route::apiResource('horarios', App\Http\Controllers\Api\HorariosController::class);
    Route::apiResource('localidades', App\Http\Controllers\Api\LocalidadesController::class);
    Route::apiResource('tipos_dieta', App\Http\Controllers\Api\TiposDietaController::class);
});