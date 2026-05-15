import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Reporte } from '../types/reporte';

const API_URL = 'http://localhost:3001/api';

const DetalleReporteScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

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
      case 'pendiente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'en_proceso': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'resuelto': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'rechazado': return 'bg-red-500/20 text-red-300 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'resuelto': return 'Resuelto';
      case 'rechazado': return 'Rechazado';
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
        <p className="text-red-400">{error || 'Reporte no encontrado'}</p>
        <button
          onClick={() => navigate('/mis-reportes')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          Volver a Mis Reportes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
      <button
        onClick={() => navigate('/mis-reportes')}
        className="mb-6 text-gray-400 hover:text-white transition flex items-center gap-2"
      >
        ← Volver a Mis Reportes
      </button>

      <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {reporte.titulo}
        </h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(reporte.estado)}`}>
          {getEstadoTexto(reporte.estado)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Descripción del incidente</p>
            <p className="text-white">{reporte.columna_unica}</p>
          </div>

          {reporte.observaciones && (
            <div className="p-4 bg-white/5 rounded-xl">
              <p className="text-gray-400 text-sm mb-1">Observaciones</p>
              <p className="text-white">{reporte.observaciones}</p>
            </div>
          )}

          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Categoría asignada por IA</p>
            <p className="text-white">
              {reporte.categoria_asignada_por_ia || 'Pendiente de clasificar'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Dirección</p>
            <p className="text-white">{reporte.direccion}</p>
            {reporte.latitud !== 0 && reporte.longitud !== 0 && (
              <a
                href={`https://www.google.com/maps?q=${reporte.latitud},${reporte.longitud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm mt-2 inline-block hover:underline"
              >
                Ver en Google Maps →
              </a>
            )}
          </div>

          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Fecha y hora</p>
            <p className="text-white">{formatearFecha(reporte.fecha_hora)}</p>
          </div>
        </div>
      </div>

      {reporte.archivo_url && (
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <p className="text-gray-400 text-sm mb-2">📎 Archivo adjunto</p>
          <a 
            href={reporte.archivo_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline text-sm flex items-center gap-2"
          >
            🔗 Ver archivo adjunto (foto/video)
          </a>
        </div>
      )}
    </div>
  );
};

export default DetalleReporteScreen;