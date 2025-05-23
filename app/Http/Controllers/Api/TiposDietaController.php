<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TiposDietas;

class TiposDietaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tipos_dietum = TiposDietas::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $tipos_dietum,
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
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        TiposDietas::create( $request->all() );
    }

    /**
     * Display the specified resource.
     */
    public function show(TiposDietas $tipos_dietum)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $tipos_dietum,
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
    public function update(Request $request, TiposDietas $tipos_dietum)
    {
        $tipos_dietum->update( $request->all() );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TiposDietas $tipos_dietum)
    {
        $tipos_dietum->delete();
    }
}
