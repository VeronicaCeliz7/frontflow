import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reporte } from '../types/reporte';
import UrbanFlowLogo from './UrbanFlowLogo';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

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
          headers: { Authorization: `Bearer ${token}` }
        });
        setReportes(response.data.data || []);
      } catch (err) {
        console.error('Error al cargar reportes:', err);
        setError('No se pudieron cargar tus reportes');
      } finally {
        setCargando(false);
      }
    };
    fetchReportes();
  }, [getToken]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'en_proceso': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'resuelto': return 'bg-green-50 text-green-700 border-green-200';
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center mb-6">
        <UrbanFlowLogo size="large" showText={true} />
        <h1 className="text-xl font-semibold text-gray-900 mt-3">Mis Reportes</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm mx-2">
          {error}
        </div>
      )}

      {reportes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No tienes reportes aún</p>
          <button
            onClick={() => navigate('/nuevo-reporte')}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Crear mi primer reporte
          </button>
        </div>
      ) : (
        <div>
          {reportes.map((reporte) => (
            <div
              key={reporte._id}
              className="bg-white border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer w-full py-3"
              onClick={() => navigate(`/reporte/${reporte._id}`)}
            >
              <div className="flex justify-between items-start gap-2 px-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-900 font-medium text-sm">
                    {reporte.titulo}
                  </h3>
                  <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                    {reporte.columna_unica}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatearFecha(reporte.fecha_hora)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {reporte.direccion?.substring(0, 40)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0 pr-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getEstadoBadge(reporte.estado)}`}>
                    {getEstadoTexto(reporte.estado)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/reporte/${reporte._id}`);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                  >
                    Ver detalle
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 pt-3 text-center pb-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default MisReportesScreen;