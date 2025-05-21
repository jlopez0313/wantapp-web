<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comercios;
use App\Models\Horarios;
use App\Models\Franjas;

class HorariosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $horarios = Horarios::all();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $horarios,
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
        \DB::transaction(function () use ($request) {
            $comercio = Comercios::find($request->comercio);

            $horariosIds = $comercio->horarios()->pluck('id');
            Franjas::whereIn('horarios_id', $horariosIds)->delete();
            Horarios::where('comercios_id', $comercio->id)->delete();
            
            foreach ($request->dias as $dia) {

                $horario = $comercio->horarios()->create([
                    'dia' => $dia['dia'],
                    'abierto' => $dia['abierto']
                ]);
                
                if ($dia['abierto']) {                    
                    foreach ($dia['franjas'] as $franja) {
                        $horario->franjas()->create([
                            'hora_inicio' => $franja['hora_inicio'],
                            'hora_fin' => $franja['hora_fin']
                        ]);
                    }
                }
            }
        });
        
        return redirect()->back()->with('success', 'Horarios actualizados');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $comercio = Comercios::with('horarios.franjas')->find($id);

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comercio->horarios,
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
    public function update(Request $request, Horarios $horario)
    {
        $horario->update( $request->all() );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Horarios $horario)
    {
        $horario->delete();
    }
}
