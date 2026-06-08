const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// 👇 Agrega estos logs para ver qué valores están llegando
console.log('🔍 Cloud Name:', CLOUDINARY_CLOUD_NAME);
console.log('🔍 Upload Preset:', CLOUDINARY_UPLOAD_PRESET);

export const subirArchivoACloudinary = async (file: File): Promise<{ url: string; publicId: string; tipo: 'image' | 'video' }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
  const tipo = file.type.startsWith('image/') ? 'image' : 'video';
  
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${tipo}/upload`;
  console.log('🔍 URL completa:', url); // 👈 Ver la URL que se genera
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    console.log('🔍 Respuesta Cloudinary:', data); // 👈 Ver el error exacto
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Error al subir archivo');
    }
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      tipo,
    };
  } catch (error) {
    console.error('Error en Cloudinary:', error);
    throw error;
  }
};

console.log('CLOUD NAME =', CLOUDINARY_CLOUD_NAME)
console.log('UPLOAD PRESET =', CLOUDINARY_UPLOAD_PRESET)