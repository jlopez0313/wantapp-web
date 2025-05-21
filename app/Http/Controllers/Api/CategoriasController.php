<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Categorias;

class CategoriasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categorias = Categorias::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $categorias,
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
        try {
            Categorias::create( $request->all() );
        } catch(\Exception $ex) {
            return back()->withErrors([
                'nombre' => 'Error al guardar',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Categorias $categoria)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $categoria,
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
    public function update(Request $request, Categorias $categoria)
    {
        $categoria->update( $request->all() );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Categorias $categoria)
    {
        $categoria->delete();
    }
}
