import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import MapaIncidente from './MapaIncidente';
import FileUpload from './FileUpload';
import { Ubicacion } from '../types/reporte';

const API_URL = 'http://localhost:3001/api';

const CrearReporteScreen = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  
  const [formData, setFormData] = useState({
    titulo: '',
    columna_unica: '',
    observaciones: '',
    fecha_hora: new Date().toISOString().slice(0, 16)
  });
  
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [archivoUrl, setArchivoUrl] = useState('');
  const [archivoPublicId, setArchivoPublicId] = useState('');
  const [archivoTipo, setArchivoTipo] = useState<'image' | 'video' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obligatorios
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return;
    }
    
    if (!formData.columna_unica.trim()) {
      setError('Describe el incidente');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    // Preparar la dirección con valor por defecto seguro
    const direccionFinal = ubicacion?.direccion 
      ? ubicacion.direccion 
      : 'Dirección no especificada';
    
    const latitudFinal = ubicacion?.coordenadas?.lat || 0;
    const longitudFinal = ubicacion?.coordenadas?.lng || 0;
    
    // Logs para ver qué datos se están enviando
    console.log('📤 DATOS COMPLETOS A ENVIAR:');
    console.log('  titulo:', formData.titulo);
    console.log('  columna_unica:', formData.columna_unica);
    console.log('  direccion:', direccionFinal);
    console.log('  latitud:', latitudFinal);
    console.log('  longitud:', longitudFinal);
    console.log('  fecha_hora:', formData.fecha_hora);
    console.log('  observaciones:', formData.observaciones);
    
    try {
      const token = await getToken();
      console.log('🔑 Token obtenido:', token ? '✅ Sí' : '❌ No');
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      const datos = {
        titulo: formData.titulo.trim(),
        columna_unica: formData.columna_unica.trim(),
        direccion: direccionFinal,
        latitud: latitudFinal,
        longitud: longitudFinal,
        observaciones: formData.observaciones.trim() || '',
        fecha_hora: new Date(formData.fecha_hora),
        archivo_url: archivoUrl || undefined,
        archivo_public_id: archivoPublicId || undefined,
        archivo_tipo: archivoTipo || undefined,
      };
      
      console.log('📤 Enviando al backend:', JSON.stringify(datos, null, 2));
      
      const response = await axios.post(`${API_URL}/reportes`, datos, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Reporte creado:', response.data);
      navigate('/');
    } catch (err: any) {
      console.error('❌ Error detallado:', err);
      console.error('❌ Response data:', err.response?.data);
      console.error('❌ Status:', err.response?.status);
      
      const mensajeError = err.response?.data?.error || 
                           err.response?.data?.message || 
                           err.message || 
                           'Error al crear el reporte';
      setError(mensajeError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Reportar Incidente
      </h1>
      <p className="text-gray-300 mb-6">
        Cuéntanos qué está pasando en tu ciudad
      </p>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Columna izquierda */}
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Título del incidente *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="Ej: Bache en la calle Principal"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Describe el incidente *
              </label>
              <textarea
                value={formData.columna_unica}
                onChange={(e) => setFormData({...formData, columna_unica: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="Describe qué está pasando (ej: Hay un bache enorme en la esquina)"
                rows={3}
              />
              <p className="text-gray-400 text-xs mt-1">
                Este texto será analizado por IA para categorizar el incidente
              </p>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Observaciones adicionales
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                placeholder="Más detalles..."
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Fecha y hora *
              </label>
              <input
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500 transition"
              />
            </div>
            
            <div>
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
          
          {/* Columna derecha */}
          <div>
            <label className="block text-white font-medium mb-2">
              Ubicación en el mapa (opcional)
            </label>
            <MapaIncidente onUbicacionChange={setUbicacion} />
            {ubicacion && (
              <div className="mt-3 p-3 bg-blue-500/20 rounded-xl">
                <p className="text-blue-200 text-sm">📍 {ubicacion.direccion}</p>
              </div>
            )}
            {!ubicacion && (
              <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                <p className="text-yellow-200 text-sm">
                  💡 Puedes usar el botón GPS o escribir una dirección. Si no agregas ubicación, se guardará como "Dirección no especificada".
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