import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Reporte } from '../types/reporte';
import { X } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

const DetalleReporteScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [imagenModal, setImagenModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchReporte = async () => {
      if (!id) {
        console.error('No hay ID en la URL');
        setError('ID de reporte no encontrado');
        setCargando(false);
        return;
      }
      
      console.log('🔍 Cargando reporte con ID:', id);
      
      try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/reportes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('📦 Reporte cargado:', response.data);
        setReporte(response.data.data);
      } catch (err: any) {
        console.error('❌ Error al cargar reporte:', err);
        setError('No se pudo cargar el detalle del reporte');
      } finally {
        setCargando(false);
      }
    };

    fetchReporte();
  }, [id, getToken]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'reportado':
      case 'validacion_inicial':
      case 'aceptado':
      case 'pendiente':
        return 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';

      case 'asignado':
      case 'en_proceso':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';

      case 'resuelto':
      case 'verificado':
      case 'cerrado':
        return 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';

      case 'rechazado':
      case 'duplicado':
      case 'informacion_insuficiente':
      case 'fuera_de_jurisdiccion':
        return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';

      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'reportado': return 'Reportado';
      case 'validacion_inicial': return 'Validación inicial';
      case 'aceptado': return 'Aceptado';
      case 'asignado': return 'Asignado';
      case 'en_proceso': return 'En proceso';
      case 'resuelto': return 'Resuelto';
      case 'verificado': return 'Verificado';
      case 'cerrado': return 'Cerrado';
      case 'rechazado': return 'Rechazado';
      case 'duplicado': return 'Duplicado';
      case 'informacion_insuficiente': return 'Información insuficiente';
      case 'fuera_de_jurisdiccion': return 'Fuera de jurisdicción';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  };

  const formatearFecha = (fecha: Date) => {
    const date = new Date(fecha);
    date.setHours(date.getHours() + 3);
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
        <p className="text-red-600 dark:text-red-400">{error || 'Reporte no encontrado'}</p>
        <button
          onClick={() => navigate('/mis-reportes')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          Volver a Mis Reportes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 md:p-8">
      <button
        onClick={() => navigate('/mis-reportes')}
        className="mb-6 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition flex items-center gap-2"
      >
        ← Volver a Mis Reportes
      </button>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {reporte.titulo}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(reporte.estado)}`}>
          {getEstadoTexto(reporte.estado)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Descripción del incidente</p>
            <p className="text-gray-800 dark:text-gray-200">{reporte.columna_unica}</p>
          </div>

          {reporte.observaciones && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Observaciones</p>
              <p className="text-gray-800 dark:text-gray-200">{reporte.observaciones}</p>
            </div>
          )}

          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Categoría asignada por IA</p>
            <p className="text-gray-800 dark:text-gray-200">
              {reporte.categoria_asignada_por_ia || 'Pendiente de clasificar'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Dirección</p>
            <p className="text-gray-800 dark:text-gray-200">{reporte.direccion}</p>
            {reporte.latitud !== 0 && reporte.longitud !== 0 && (
              <button
                onClick={() => navigate(`/mapa-interno?lat=${reporte.latitud}&lng=${reporte.longitud}&zoom=18&direccion=${encodeURIComponent(reporte.direccion || 'Sin dirección')}`)}
                className="text-blue-600 dark:text-blue-400 text-sm mt-2 inline-block hover:underline"
              >
                Ver ubicación en el mapa →
              </button>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Fecha y hora</p>
            <p className="text-gray-800 dark:text-gray-200">{formatearFecha(reporte.fecha_hora)}</p>
          </div>
        </div>
      </div>

      {reporte.archivo_url && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">📎 Archivo adjunto</p>
          <button
            onClick={() => setImagenModal(reporte.archivo_url)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-2"
          >
            📷 Ver imagen adjunta
          </button>
        </div>
      )}

      {/* Modal de imagen mejorado - tarjeta con imagen */}
      {imagenModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setImagenModal(null)}
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                📷 Imagen del reporte
              </h3>
              <button
                onClick={() => setImagenModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido: imagen */}
            <div className="p-4 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={imagenModal}
                alt="Imagen del reporte"
                className="max-w-full max-h-[65vh] rounded-lg object-contain"
              />
            </div>

            {/* Footer con botón de cierre */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setImagenModal(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleReporteScreen;