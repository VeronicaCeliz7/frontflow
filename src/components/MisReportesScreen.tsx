import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reporte } from '../types/reporte';

const API_URL = 'http://localhost:3001/api';

const MisReportesScreen = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(`${API_URL}/reportes/mis-reportes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReportes(response.data.data || []);
      } catch (err: any) {
        console.error('Error al cargar reportes:', err);
        setError('No se pudieron cargar tus reportes');
      } finally {
        setCargando(false);
      }
    };

    fetchReportes();
  }, [getToken]);

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

  // 👇 Función corregida para mostrar la hora local de Argentina (UTC-3)
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
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

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Mis Reportes
        </h1>
        <button
          onClick={() => navigate('/nuevo-reporte')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition text-sm"
        >
          + Nuevo Reporte
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
          {error}
        </div>
      )}

      {reportes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No tienes reportes aún</p>
          <button
            onClick={() => navigate('/nuevo-reporte')}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
          >
            Crear mi primer reporte
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reportes.map((reporte) => (
            <div
              key={reporte._id}
              className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition cursor-pointer"
              onClick={() => {
                console.log('Navegando a detalle:', reporte._id);
                navigate(`/reporte/${reporte._id}`);
              }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-lg">
                      {reporte.titulo}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reporte.estado)}`}>
                      {getEstadoTexto(reporte.estado)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                    {reporte.columna_unica}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    <span>📅 {formatearFecha(reporte.fecha_hora)}</span>
                    <span>📍 {reporte.direccion.substring(0, 50)}</span>
                    {reporte.categoria_asignada_por_ia && (
                      <span className="px-2 py-0.5 bg-purple-500/20 rounded-full text-purple-300">
                        🤖 {reporte.categoria_asignada_por_ia}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Botón ver detalle:', reporte._id);
                      navigate(`/reporte/${reporte._id}`);
                    }}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition"
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-white/10">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white transition"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default MisReportesScreen;