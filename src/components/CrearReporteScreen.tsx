import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import MapaIncidente from './MapaIncidente';
import FileUpload from './FileUpload';
import { Ubicacion } from '../types/reporte';
import UrbanFlowLogo from './UrbanFlowLogo';

const API_URL = 'http://localhost:3001/api';

// Clase unificada para todos los inputs
const inputClassName = "w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-200";

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
  const [archivoUrl, setArchivoUrl] = useState('');
  const [archivoPublicId, setArchivoPublicId] = useState('');
  const [archivoTipo, setArchivoTipo] = useState<'image' | 'video' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar título
    if (!formData.titulo.trim()) {
      setError('📝 El título es obligatorio');
      return;
    }
    
    // Validar categoría
    if (!categoria) {
      setError('🏷️ Selecciona una categoría');
      return;
    }
    
    // Validar descripción
    if (!formData.columna_unica.trim()) {
      setError('📄 Describe el incidente en detalle');
      return;
    }
    
    // Validar ubicación
    if (!ubicacion) {
      setError('📍 La ubicación es obligatoria. Usá el GPS o hacé clic en el mapa para seleccionar una ubicación');
      return;
    }
    
    // Validar archivo multimedia
    if (!archivoUrl) {
      setError('📸 Es obligatorio adjuntar una foto o video como evidencia');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    const direccionFinal = ubicacion?.direccion 
      ? ubicacion.direccion 
      : 'Dirección no especificada';
    
    const latitudFinal = ubicacion?.coordenadas?.lat || 0;
    const longitudFinal = ubicacion?.coordenadas?.lng || 0;
    console.log('🔍 formData COMPLETO:', JSON.stringify(formData, null, 2));

    
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
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
        // fecha_hora NO se envía - el backend la genera automáticamente
      };
      console.log('🔍 DATOS QUE SE ENVÍAN:', JSON.stringify(datos, null, 2));

      await axios.post(`${API_URL}/reportes`, datos, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      navigate('/');
    } catch (err: any) {
      console.error('❌ Error:', err);
      const mensajeError = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           'Error al crear el reporte';
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

  // Obtener fecha y hora actual para mostrar al usuario
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
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
      <div className="flex flex-col items-center mb-6">
        <UrbanFlowLogo size="large" />
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
          Reportar Incidente
        </h1>
        <p className="text-gray-300">
          Cuéntanos qué está pasando en tu ciudad
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-6">
            {/* Selector de categoría */}
            <div>
              <label className="block text-white font-medium mb-2">
                Categoría del incidente *
              </label>
              <div className="relative">
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className={inputClassName + " appearance-none cursor-pointer"}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1.25rem'
                  }}
                  required
                >
                  <option value="" disabled className="bg-gray-900 text-gray-400">
                    ─── Seleccionar categoría ───
                  </option>
                  {categoriasList.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-gray-900 text-white">
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Seleccioná la categoría que mejor describa el problema
              </p>
            </div>

            {/* Título */}
            <div>
              <label className="block text-white font-medium mb-2">
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
              <label className="block text-white font-medium mb-2">
                Describe el incidente *
              </label>
              <textarea
                value={formData.columna_unica}
                onChange={(e) => setFormData({...formData, columna_unica: e.target.value})}
                className={inputClassName}
                placeholder="Describe en detalle qué está pasando y dónde exactamente..."
                rows={3}
              />
              <p className="text-gray-400 text-xs mt-1">
                Cuantos más detalles, mejor podremos ayudarte
              </p>
            </div>
            
            {/* Observaciones */}
            <div>
              <label className="block text-white font-medium mb-2">
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
            
            {/* Fecha y hora - AUTOMÁTICA (solo informativa) */}
            <div>
              <label className="block text-white font-medium mb-2">
                📅 Fecha y hora del reporte
              </label>
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-200 text-sm flex items-center gap-2">
                  <span className="text-lg">✅</span> Se registrará automáticamente al enviar
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  📍 Fecha: {fechaFormateada} - ⏰ Hora: {horaFormateada} hs (momento del envío)
                </p>
              </div>
            </div>
            
            {/* Subida de archivos - OBLIGATORIO */}
            <div>
              <label className="block text-white font-medium mb-2">
                Foto o video * (obligatorio)
              </label>
              <FileUpload
                onFileUploaded={(url, publicId, tipo) => {
                  setArchivoUrl(url);
                  setArchivoPublicId(publicId);
                  setArchivoTipo(tipo);
                }}
                onError={setError}
              />
            </div>
          </div>
          
          {/* Columna derecha - Mapa */}
          <div>
            <label className="block text-white font-medium mb-2">
              Ubicación en el mapa * (obligatorio)
            </label>
            <MapaIncidente onUbicacionChange={setUbicacion} categoria={categoria} />
            {ubicacion && (
              <div className="mt-3 p-3 bg-blue-500/20 rounded-xl">
                <p className="text-blue-200 text-sm">📍 {ubicacion.direccion}</p>
              </div>
            )}
            {!ubicacion && (
              <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-yellow-200 text-sm">
                  ⚠️ La ubicación es obligatoria. Usá el botón GPS o hacé clic en el mapa.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition disabled:opacity-50"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearReporteScreen;