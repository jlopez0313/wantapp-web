<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RedesSociales;

class RedesSocialesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $redes = RedesSociales::where('comercios_id', $request->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $redes,
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
            RedesSociales::create( $request->all() );
        } catch(\Exception $ex) {
            return back()->withErrors([
                'nombre' => 'Error al guardar',
                'url' => 'Error al guardar',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(RedesSociales $rede)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $rede,
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
    public function update(Request $request, RedesSociales $rede)
    {
        $rede->update( $request->all() );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RedesSociales $rede)
    {
        $rede->delete();
    }
}
