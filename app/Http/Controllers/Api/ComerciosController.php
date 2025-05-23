<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ImageCompressionService;
use App\Models\Comercios;
use App\Models\ComerciosCategorias;

class ComerciosController extends Controller
{
    protected $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        \DB::beginTransaction();

        $data = $request->except(['logo', 'banner', 'categorias', 'numero', 'phone', 'country', 'area', 'tipos_dieta']);

        if ( $request->logo ) {
            $compressedLogo = $this->imageCompressionService->compressImage($request->logo, "app/files/");
            $data['logo'] = $compressedLogo;
        }

        if ( $request->banner ) {
            $compressedBanner = $this->imageCompressionService->compressImage($request->banner, "app/files/");
            $data['banner'] = $compressedBanner;
        }

        try {
            $comercio = Comercios::create( $data );
            $comercio->categorias()->sync($request->categorias ?? []);
            $comercio->tipos_dieta()->sync($request->tipos_dieta ?? []);

            $comercio->telefono()->create([
                'codigo_pais' => $request->country,
                'codigo_area' => $request->area,
                'numero' => $request->numero,
            ]);

            \DB::commit();
        } catch(\Exception $ex) {
            
            \DB::rollBack();

            return back()->withErrors([
                'nombre' => 'Error al guardar',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Comercios $comercio)
    {
        $comercio->load('telefono', 'localidad', 'categorias', 'tipos_dieta');
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $comercio,
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
    public function update(Request $request, Comercios $comercio)
    {
        \DB::beginTransaction();

        $data = $request->except(['logo', 'banner', 'categorias', 'numero', 'phone', 'country', 'area', 'tipos_dieta']);

        if ( $request->logo && $request->logo != $comercio->logo ) {
            \Storage::delete( $comercio->logo );

            $compressedLogo = $this->imageCompressionService->compressImage($request->logo, "app/files/");
            $data['logo'] = $compressedLogo;
        }

        if ( $request->banner && $request->banner != $comercio->banner ) {
            \Storage::delete( $comercio->banner );

            $compressedBanner = $this->imageCompressionService->compressImage($request->banner, "app/files/");
            $data['banner'] = $compressedBanner;
        }

        $comercio->categorias()->sync($request->categorias ?? []);
        $comercio->tipos_dieta()->sync($request->tipos_dieta ?? []);

        $comercio->telefono()->update([
            'codigo_pais' => $request->country,
            'codigo_area' => $request->area,
            'numero' => $request->numero,
        ]);

        try {
            $comercio->update( $data );
            \DB::commit();

        } catch(\Exception $ex) {
            \DB::rollback();

            return back()->withErrors([
                'nombre' => 'Error al guardar',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comercios $comercio)
    {
        $comercio->delete();
    }


    public function localidad(string $id)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => Comercios::where('localidades_id', $id)->get(),
        ]);
    }
}
