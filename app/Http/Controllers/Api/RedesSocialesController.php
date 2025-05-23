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
        $request->validate([
            'comercios_id' => 'required|number|max:255',
            'nombre' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ]);

        RedesSociales::create( $request->all() );
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
        $request->validate([
            'comercios_id' => 'required|number|max:255',
            'nombre' => 'required|string|max:255',
            'url' => 'required|string|max:255',
        ]);

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
