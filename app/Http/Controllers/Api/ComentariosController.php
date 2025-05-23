<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comercios;
use App\Models\Comentarios;

class ComentariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comentarios = Comentarios::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentarios,
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
        $comentario = Comentarios::create([
            'comercios_id' => $request->comercios_id,
            'productos_id' => $request->productos_id,
            'nombre' => $request->nombre,
            'comentario' => $request->comentario,
            'fecha' => $request->fecha,
            'rating' => $request->rating,
            'aprobado' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentario,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comentario = Comentarios::with('respuesta')->find($id);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comentario,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comentarios $comentario)
    {
        $comentario->update( $request->except('respuesta') );

        $comentario->respuesta()->updateOrCreate(
            [
                'comentarios_id' => $comentario->id
            ],
            [
                'respuesta' => $request->respuesta
            ],
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comentarios $comentario)
    {
        $comentario->delete();
    }
}
