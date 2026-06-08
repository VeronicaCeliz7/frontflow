import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import MapaIncidente from './MapaIncidente';
import FileUpload from './FileUpload';
import { Ubicacion } from '../types/reporte';
import UrbanFlowLogo from './UrbanFlowLogo';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

// Clase unificada para todos los inputs (minimalista)
const inputClassName = "w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors";

const CrearReporteScreen = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [formData, setFormData] = useState({
    titulo: '',
    columna_unica: '',
    observaciones: '',
  });
  
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [direccionManual, setDireccionManual] = useState('');
  const [archivoUrl, setArchivoUrl] = useState('');
  const [archivoPublicId, setArchivoPublicId] = useState('');
  const [archivoTipo, setArchivoTipo] = useState<'image' | 'video' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!categoria) {
      setError('Selecciona una categoría');
      return;
    }
    
    if (!formData.columna_unica.trim()) {
      setError('Describe el incidente');
      return;
    }
    
    if (!ubicacion) {
      setError('La ubicación es obligatoria. Usá el GPS o hacé clic en el mapa');
      return;
    }
    
    if (!direccionManual.trim()) {
      setError('La dirección es obligatoria');
      return;
    }
    if (!archivoUrl || !archivoPublicId || !archivoTipo) {
  setError('Es obligatorio adjuntar una foto o video. Esperá a que termine de cargarse antes de enviar.');
  return;

    }
    
    setIsSubmitting(true);
    setError('');
    
    const direccionFinal = direccionManual.trim();
    const latitudFinal = ubicacion?.coordenadas?.lat || 0;
    const longitudFinal = ubicacion?.coordenadas?.lng || 0;
    
    try {
      const token = await getToken();
      
      if (!token) throw new Error('No se pudo obtener el token');
      
      const datos = {
        titulo: formData.titulo.trim(),
        categoria: categoria,
        columna_unica: formData.columna_unica.trim(),
        direccion: direccionFinal,
        latitud: latitudFinal,
        longitud: longitudFinal,
        observaciones: formData.observaciones.trim() || '',
        archivo_url: archivoUrl,
        archivo_public_id: archivoPublicId,
        archivo_tipo: archivoTipo,
      };

      await axios.post(`${API_URL}/reportes`, datos, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('Error:', err);
      const mensajeError = err.response?.data?.error || err.message || 'Error al crear el reporte';
      setError(mensajeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriasList = [
    { value: 'bache', label: 'Bache', emoji: '🕳️' },
    { value: 'semaforo', label: 'Semáforo', emoji: '🚦' },
    { value: 'iluminacion', label: 'Iluminación', emoji: '💡' },
    { value: 'basura', label: 'Basura', emoji: '🗑️' },
    { value: 'seguridad', label: 'Seguridad', emoji: '👮' },
    { value: 'otros', label: 'Otros', emoji: '📌' },
  ];

  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const horaFormateada = fechaActual.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8">
      <div className="flex flex-col items-center mb-6">
        <UrbanFlowLogo size="large" showText={true} />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-4">
          Reportar Incidente
        </h1>
        <p className="text-gray-500">
          Contanos qué está pasando en tu ciudad
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-5">
            {/* Selector de categoría */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Categoría del incidente *
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={inputClassName + " appearance-none cursor-pointer"}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem'
                }}
                required
              >
                <option value="" disabled>─── Seleccionar categoría ───</option>
                {categoriasList.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Título */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Título del incidente *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className={inputClassName}
                placeholder="Ej: Bache en la calle Principal"
              />
            </div>
            
            {/* Descripción */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Describe el incidente *
              </label>
              <textarea
                value={formData.columna_unica}
                onChange={(e) => setFormData({...formData, columna_unica: e.target.value})}
                className={inputClassName}
                placeholder="Describe en detalle qué está pasando..."
                rows={3}
              />
            </div>
            
            {/* Observaciones */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Observaciones adicionales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                className={inputClassName}
                placeholder="Más detalles (opcional)..."
                rows={2}
              />
            </div>
            
            {/* Fecha y hora - automática */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                📅 Fecha y hora del reporte
              </label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-gray-600 text-sm">✅ Se registrará automáticamente al enviar</p>
                <p className="text-gray-400 text-xs mt-1">
                  📍 Fecha: {fechaFormateada} - ⏰ Hora: {horaFormateada} hs
                </p>
              </div>
            </div>
            
            {/* Subida de archivos */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Foto o video * (obligatorio)
              </label>
              <FileUpload
                onFileUploaded={(url, publicId, tipo) => {
                  console.log('ARCHIVO SUBIDO:', { url, publicId, tipo })

                  setArchivoUrl(url);
                  setArchivoPublicId(publicId);
                  setArchivoTipo(tipo);
                  {archivoUrl && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
                  ✅ Archivo cargado correctamente
                </div>
                )}
                }}
               
                onError={setError}
              />
            </div>
          </div>
          
          {/* Columna derecha - Mapa + Dirección manual */}
          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                📍 Ubicación en el mapa * (obligatorio)
              </label>
              <MapaIncidente onUbicacionChange={setUbicacion} categoria={categoria} />
              {ubicacion && (
                <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-600 text-sm">✅ Ubicación seleccionada</p>
                </div>
              )}
              {!ubicacion && (
                <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <p className="text-gray-500 text-sm">
                    ⚠️ La ubicación es obligatoria. Usá el botón GPS o hacé clic en el mapa.
                  </p>
                </div>
              )}
            </div>

            {/* Dirección escrita por el usuario */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                📝 Dirección *
              </label>
              <input
                type="text"
                value={direccionManual}
                onChange={(e) => setDireccionManual(e.target.value)}
                className={inputClassName}
                placeholder="Ej: Av. Libertador 3000, o 'Descampado - Ruta 8 km 42'"
                required
              />
              <p className="text-gray-400 text-xs mt-1">
                Escribí la dirección exacta o una referencia clara del lugar
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearReporteScreen;