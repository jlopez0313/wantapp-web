<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ImageCompressionService;
use App\Models\Productos;

class ProductosController extends Controller
{
    protected $imageCompressionService;

    public function __construct(ImageCompressionService $imageCompressionService)
    {
        $this->imageCompressionService = $imageCompressionService;
    }

     /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $productos = Productos::where('comercios_id', $request->id)->get();

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $productos,
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
        $data = $request->except(['rating', 'imagen']);

        if ( $request->imagen ) {
            $compressedBanner = $this->imageCompressionService->compressImage($request->imagen, "app/files/");
            $data['imagen'] = $compressedBanner;
        }

        try {
            Productos::create( $data );
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
    public function show(Productos $producto)
    {
        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data' => $producto,
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
    public function update(Request $request, Productos $producto)
    {
        $data = $request->except(['rating', 'imagen']);

        if ( $request->imagen && $request->imagen != $producto->imagen ) {
            $compressedBanner = $this->imageCompressionService->compressImage($request->imagen, "app/files/");
            $data['imagen'] = $compressedBanner;
        }

        $producto->update( $data );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Productos $producto)
    {
        $producto->delete();
    }
}
