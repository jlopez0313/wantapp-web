<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Comentarios;

class ComentariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id, Request $request)
    {
        $user = \Auth::user();

        if ($request->type === 'comercios') {
            if (!$user->comercios()
                    ->where('id', $id)
                    ->exists()
            ){
                abort(403, 'Acceso no autorizado');
            }
        } elseif ($request->type === 'productos') {
            if (!$user->comercios()
                    ->whereHas(
                        'productos',
                        fn ($q) => $q->where('id', $id)
                    )->exists()
            ){
                abort(403, 'Acceso no autorizado');
            }
        } else {
            abort(400, 'Tipo no válido');
        }

        $lista = Comentarios::where($request->type . '_id', $id)
            ->orderByDesc('created_at')
            ->paginate(1);
        
        return Inertia::render('comentarios/Index', [
            'lista' => $lista,
            'type' => $request->type,
            'id' => $id,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Comentarios $comentario)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comentarios $comentario)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
