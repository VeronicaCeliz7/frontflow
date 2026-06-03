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

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      onError('❌ Solo se permiten imágenes o videos');
      return;
    }

    const MAX_IMAGE_SIZE = 3 * 1024 * 1024;   // 3 MB
    const MAX_VIDEO_SIZE = 10 * 1024 * 1024;  // 10 MB

    if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
      onError('📸 La imagen no puede superar los 3MB');
      return;
    }
    
    if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE) {
      onError('🎥 El video no puede superar los 10MB');
      return;
    }

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
      <div>
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
          className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isUploading ? '📤 Subiendo...' : '📸 Seleccionar foto o video'}
        </button>
      </div>
      
      {isUploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
          <span>Subiendo archivo...</span>
        </div>
      )}
      
      {preview && (
        <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
          {preview.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img src={preview} alt="Preview" className="max-h-48 w-full object-cover" />
          ) : (
            <video src={preview} controls className="max-h-48 w-full" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;