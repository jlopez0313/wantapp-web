<?php

namespace App\Services;

use Intervention\Image\Image;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;

class ImageCompressionService
{

    /**
     * Comprime un archivo de imagen con  baja tasa de bits.
     *
     * @param any $imagen Archivo uploaded.
     * @param string $path Ruta de almacenamiento.
     * @return string|null URL pública del archivo comprimido o null si falla.
     */
    public function compressImage($image, $path) 
    {
        $manager = ImageManager::gd();
        $resizedImage = $manager->read($image->getRealPath())
            ->scale(width: 800);

        $extension = $image->getClientOriginalExtension();
        $filename = uniqid() . '.' . $extension;

        $fullPath = storage_path("{$path}{$filename}");
        $resizedImage->save($fullPath, 100, $extension);

        return explode('/', $path)[1] . '/' . $filename;
    }

     /**
     * Comprime un archivo de base64 con baja tasa de bits.
     *
     * @param any $base64Str Archivo en base64.
     * @param string $path Ruta de almacenamiento.
     * @return string|null URL pública del archivo comprimido o null si falla.
     */
    public function compressBase64($image_64, $path) 
    {
        $extension = explode('/', explode(':', substr($image_64, 0, strpos($image_64, ';')))[1])[1];
        $replace = substr($image_64, 0, strpos($image_64, ',') + 1);
        $image = str_replace($replace, '', $image_64);
        $image = str_replace(' ', '+', $image);

        $filename = uniqid() . '.' . $extension;
        
        $manager = ImageManager::gd();
        $resizedImage = $manager->read( base64_decode($image) )
            ->scale(width: 800);

        $fullPath = storage_path("{$path}/{$filename}");
        $resizedImage->save($fullPath, 100, $extension);

        return explode('/', $path)[1] . '/' . $filename;
    }

}