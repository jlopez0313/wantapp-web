<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => '1.0.0',
        'app_name' => env('APP_NAME'),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::middleware(['role:admin'])
        ->group( function(){
            Route::controller(App\Http\Controllers\CategoriasController::class)
                ->prefix('categorias')
                ->group( function(){
                    Route::get('/', 'index');
                });
            
            Route::controller(App\Http\Controllers\LocalidadesController::class)
                ->prefix('localidades')
                ->group( function(){
                    Route::get('/', 'index');
                });
                
            Route::controller(App\Http\Controllers\TiposDietaController::class)
                ->prefix('tipos_dieta')
                ->group( function(){
                    Route::get('/', 'index');
                });
            
            Route::controller(App\Http\Controllers\UsuariosController::class)
                ->prefix('usuarios')
                ->group( function(){
                    Route::get('/', 'index');
                    Route::get('/comercios/{id}', 'comercios');
                });
        });

    Route::controller(App\Http\Controllers\ComerciosController::class)
        ->prefix('comercios')
        ->group( function(){
            Route::get('/', 'index');
            Route::middleware(['role:admin'])
                ->group( function(){
                    Route::get('/crear', 'create')->name('comercios.create');
                    Route::get('/editar/{id}', 'edit')->name('comercios.edit');
                    Route::get('/usuario/{id}', 'usuario')->name('comercios.usuario');
            });
        });
    
    Route::controller(App\Http\Controllers\ProductosController::class)
        ->prefix('productos')
        ->group( function(){
            Route::get('/{id}', 'index');
        });

    Route::controller(App\Http\Controllers\ComentariosController::class)
        ->prefix('comentarios')
        ->group( function(){
            Route::get('/comercios/{id}', 'index')->defaults('type', 'comercios');
            Route::get('/productos/{id}', 'index')->defaults('type', 'productos');
        });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
