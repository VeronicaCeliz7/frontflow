import { useState, useRef } from 'react';
import { subirArchivoACloudinary } from '../Services/cloudinary';

interface FileUploadProps {
  onFileUploaded: (url: string, publicId: string, tipo: 'image' | 'video') => void;
  onError: (error: string) => void;
}

const FileUpload = ({ onFileUploaded, onError }: FileUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      onError('❌ Solo se permiten imágenes o videos');
      return;
    }

    // ✅ NUEVOS LÍMITES (cambiados)
    const MAX_IMAGE_SIZE = 3 * 1024 * 1024;   // 3 MB para imágenes
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024;  // 10 MB para videos

    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      onError('📸 La imagen no puede superar los 3MB');
      return;
    }
    
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      onError('🎥 El video no puede superar los 10MB');
      return;
    }

    // Mostrar preview local
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    
    setIsUploading(true);
    
    try {
      const result = await subirArchivoACloudinary(file);
      onFileUploaded(result.url, result.publicId, result.tipo);
    } catch (error: any) {
      console.error('Error al subir:', error);
      onError(error.message || 'Error al subir el archivo');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition disabled:opacity-50"
        >
          {isUploading ? '📤 Subiendo...' : '📸 Seleccionar foto o video'}
        </button>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-gray-300">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
          <span>Subiendo archivo...</span>
        </div>
      )}
      
      {preview && (
        <div className="mt-2">
          {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img src={preview} alt="Preview" className="rounded-lg max-h-48 object-cover" />
          ) : (
            <video src={preview} controls className="rounded-lg max-h-48" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;