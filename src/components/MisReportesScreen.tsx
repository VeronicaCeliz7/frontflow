import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reporte } from '../types/reporte';
import UrbanFlowLogo from './UrbanFlowLogo';
import { Calendar, MapPin, ChevronRight, Brain, AlertTriangle, GitMerge, FileText, CheckCircle, Clock } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

// Componente StatCard interno - IDÉNTICO al que usa AdminDashboard
function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }: any) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-600',  text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-500', text: 'text-yellow-600' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-600',    text: 'text-red-600' },
  };

  const c = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className={`rounded-2xl p-5 ${c.bg} flex items-center gap-4`}>
      <div className={`${c.icon} p-3 rounded-xl`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className={`text-2xl font-bold ${c.text}`}>{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

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

  // Calcular estadísticas
  const total = reportes.length;
  const pendientes = reportes.filter((r) => r.estado === 'pendiente').length;
  const enProceso = reportes.filter((r) => r.estado === 'en_proceso').length;
  const resueltos = reportes.filter((r) => r.estado === 'resuelto').length;
  // const rechazados = reportes.filter((r) => r.estado === 'rechazado').length;
  const criticos = reportes.filter((r) => r.prioridad === 'critica' || r.prioridad === 'crítica').length;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'en_proceso': return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'resuelto': return 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'rechazado': return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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

  const getPrioridadTexto = (prioridad?: string) => {
    switch (prioridad) {
      case 'critica':
      case 'crítica':
        return 'Crítica';
      case 'alta':
        return 'Alta';
      case 'media':
        return 'Media';
      case 'baja':
        return 'Baja';
      default:
        return 'Sin prioridad';
    }
  };

  const getPrioridadBadge = (prioridad?: string) => {
    switch (prioridad) {
      case 'critica':
      case 'crítica':
        return 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'alta':
        return 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800';
      case 'media':
        return 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'baja':
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
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
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center mb-6">
        <UrbanFlowLogo size="large" showText={true} />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-3">Mis Reportes</h1>
      </div>

      {/* TARJETAS DE ESTADÍSTICAS - MISMO ESTILO QUE ADMIN DASHBOARD */}
      {total > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Reclamos pendientes"
            value={pendientes}
            icon={Clock}
            color="yellow"
            subtitle="Sin resolver"
          />
          <StatCard
            title="Total"
            value={total}
            icon={FileText}
            color="blue"
            subtitle="Mis reportes"
          />
          <StatCard
            title="En proceso"
            value={enProceso}
            icon={Clock}
            color="yellow"
            subtitle="Gestionándose"
          />
          <StatCard
            title="Resueltos"
            value={resueltos}
            icon={CheckCircle}
            color="green"
            subtitle="Finalizados"
          />
        </div>
      )}

      {/* Alerta de críticos */}
      {criticos > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          Tenés {criticos} reporte(s) con prioridad crítica. Se están atendiendo con urgencia.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-md">
          {error}
        </div>
      )}

      {reportes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No tienes reportes aún</p>
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
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer mb-3 p-4 shadow-sm"
              onClick={() => navigate(`/reporte/${reporte._id}`)}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base">
                      {reporte.titulo}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getEstadoBadge(reporte.estado)}`}>
                      {getEstadoTexto(reporte.estado)}
                    </span>
                  </div>
                  
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                    {reporte.columna_unica}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatearFecha(reporte.fecha_hora)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {reporte.direccion?.substring(0, 40)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                      <Brain size={12} />
                      {reporte.categoria_asignada_por_ia || 'IA pendiente'}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${getPrioridadBadge(reporte.prioridad)}`}>
                      <AlertTriangle size={12} />
                      {getPrioridadTexto(reporte.prioridad)}
                      {typeof reporte.ai_priority_score === 'number' && ` · ${reporte.ai_priority_score}/100`}
                    </span>

                    {reporte.posible_duplicado && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                        <GitMerge size={12} />
                        Posible duplicado
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/reporte/${reporte._id}`);
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center gap-1 shrink-0"
                >
                  Ver detalle
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-3 text-center pb-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm"
        >
          ← Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default MisReportesScreen;