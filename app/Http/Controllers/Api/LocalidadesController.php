<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Localidades;

class LocalidadesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $localidades = Localidades::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $localidades,
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
            Localidades::create( $request->all() );
        } catch(\Exception $ex) {
            return back()->withErrors([
                'nombre' => 'Error al guardar',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Localidades $localidade)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $localidade,
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
    public function update(Request $request, Localidades $localidade)
    {
        $localidade->update( $request->all() );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Localidades $localidade)
    {
        $localidade->delete();
    }
}
