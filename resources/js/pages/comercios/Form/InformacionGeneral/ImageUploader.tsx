import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

export default function ImageUploader({ 
  name = 'images',
  multiple = true,
  maxFiles = 5,
  resetKey,
  initialFiles=[],
  onFilesChange 
}: any) {
  const [previews, setPreviews] = useState<any>([]);
  const fileInputRef = useRef<any>(null);

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    
    if (files.length > maxFiles) {
      alert(`Solo puedes subir un máximo de ${maxFiles} imágenes`);
      return;
    }

    const newPreviews = files.map((file: any) => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviews((prev: any) => [...prev, ...newPreviews].slice(0, maxFiles));
    onFilesChange?.([...previews.map((p: any) => p.file), ...files].slice(0, maxFiles));
  };

  const removeImage = (index: number) => {
    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index].preview); // Liberar memoria
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
    onFilesChange?.(newPreviews.map(p => p.file));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect( () => {
    const loadPreviews = () => {
        const newPreviews = initialFiles.map((file: any) => ({
            file,
            preview: '../../' + file
          }));

          setPreviews([...newPreviews])
    }

    initialFiles.length && loadPreviews()
  }, [])



  return (
    <div className="space-y-4">
      {/* Input oculto */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple={multiple}
        name={name}
      />
      
      {/* Botón para activar el input */}
      <Button disabled={maxFiles == previews.length}
        type="button"
        onClick={triggerFileInput}
        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"> Seleccionar Imágenes </Button>
      
      {/* Previsualizaciones */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {previews.map((preview: any, index: number) => (
          <div key={index} className="relative group">
            <img
              src={preview.preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              aria-label="Eliminar imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {/* Información */}
      <p className="text-xs text-gray-600">
        {previews.length} / {maxFiles} imágenes seleccionadas. Formatos soportados: JPG, PNG, WEBP.
      </p>
    </div>
  );
}