import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import SuperSidebar from './SuperSidebar';
import SuperMap from './SuperMap';
import { 
  Crown, Building2, HardHat, User, 
  AlertTriangle, FileText, TrendingUp, CheckCircle
} from 'lucide-react';
import StatCard from '../../features/municipality/components/StatCard';
import IAHeatmap from '../IAHeatmap';

import {
  getSuperDashboard,
  getSuperClientes,
  getSuperUsuarios,
  getSuperReportes,
} from '../../Services/superApi';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type SuperSection =
  | 'panel'
  | 'clientes'
  | 'usuarios'
  | 'incidentes'
  | 'informes'
  | 'analitica'
  | 'configuracion';

type DashboardData = {
  ok: boolean;
  resumen: {
    totalClientes: number;
    totalUsuarios: number;
    totalCiudadanos: number;
    totalReportes: number;
  };
  graficos: {
    reportesPorEstado: { _id: string; total: number }[];
    reportesPorPrioridad: { _id: string; total: number }[];
    reportesPorCategoria: { _id: string; total: number }[];
  };
  ultimosReportes: Reporte[];
};

type Cliente = {
  _id: string;
  nombre: string;
  tipo: string;
  localidad: string;
  provincia: string;
  pais: string;
  direccion?: string;
  latitud: number;
  longitud: number;
  activo?: boolean;
};

type Usuario = {
  _id: string;
  email: string;
  nombre?: string;
  apellido?: string;
  rol: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
  clienteNombre?: string;
  activo?: boolean;
};

type Reporte = {
  _id: string;
  titulo: string;
  clienteNombre?: string;
  estado: string;
  prioridad: string;
  categoria_asignada_por_ia?: string;
  localidad?: string;
  provincia?: string;
  pais?: string;
  latitud?: number;
  longitud?: number;
  fecha_hora: string;
  ia_procesado?: boolean;
  ai_priority_score?: number;
  posible_duplicado?: boolean;
  vectorizado?: boolean;
};

const COLORS = [
  '#2563eb',
  '#16a34a',
  '#f59e0b',
  '#dc2626',
  '#9333ea',
  '#0891b2',
  '#ea580c',
  '#64748b'
]

export default function SuperDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
 
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SuperSection>('panel');

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date())

  const nombreSuperAdmin = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  // ✅ OPTIMIZACIÓN: Carga escalonada - primero el dashboard, luego el resto
  useEffect(() => {
    async function loadData() {
      try {
        // 1. PRIMERO: cargar el dashboard (tarjetas, gráficos, alertas)
        const dashboardData = await getSuperDashboard();
        setDashboard(dashboardData);
        setLoading(false); // ✅ Mostrar el dashboard AHORA

        // 2. DESPUÉS: cargar el resto en paralelo (sin bloquear)
        try {
          const [clientesData, usuariosData, reportesData] = await Promise.all([
            getSuperClientes(),
            getSuperUsuarios(),
            getSuperReportes(),
          ]);
          setClientes(clientesData.clientes || []);
          setUsuarios(usuariosData.usuarios || []);
          setReportes(reportesData.reportes || []);
        } catch (err) {
          console.error('Error cargando datos secundarios:', err);
        }
      } catch (err) {
        console.error("Error cargando SuperDashboard:", err);
        setError('No se pudo conectar con el backend.');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const pageBg = 'bg-gray-50 dark:bg-gray-950';
  const cardBg = 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none';
  const mutedText = 'text-gray-500 dark:text-gray-400';

  const criticalCount =
    dashboard?.graficos.reportesPorPrioridad.find((item) => item._id === 'critica')?.total ?? 0;
  const highCount =
    dashboard?.graficos.reportesPorPrioridad.find((item) => item._id === 'alta')?.total ?? 0;
  const pendingCount =
    dashboard?.graficos.reportesPorEstado.find((item) => item._id === 'pendiente')?.total ?? 0;
  const resolvedCount =
    dashboard?.graficos.reportesPorEstado.find((item) => item._id === 'resuelto')?.total ?? 0;
  const enProcesoCount =
    dashboard?.graficos.reportesPorEstado.find((item) => item._id === 'en_proceso')?.total ?? 0;
  const mostFrequentCategory = dashboard?.graficos.reportesPorCategoria[0];

  const categoriasOrdenadas = dashboard?.graficos?.reportesPorCategoria
    ? [...dashboard.graficos.reportesPorCategoria]
        .sort((a, b) => b.total - a.total)
    : []

  const estadosOrdenados = dashboard?.graficos?.reportesPorEstado
    ? [...dashboard.graficos.reportesPorEstado]
        .sort((a, b) => b.total - a.total)
    : []

  return (
    <div className={`min-h-screen ${pageBg} lg:flex`}>
      <SuperSidebar
        mobileOpen={mobileOpen}
        collapsed={sidebarCollapsed}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-w-0 flex-1">
        {/* HEADER - Con botones ARRIBA y título DEBAJO */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 lg:hidden"
            >
              ☰
            </button>

            {/* BOTONES DE ROLES - ARRIBA */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate('/municipality/admin')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Building2 size={14} />
                Administrador
              </button>
              <button
                onClick={() => navigate('/municipality/operator')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <HardHat size={14} />
                Operador
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <User size={14} />
                Ciudadano
              </button>
              <button
                onClick={() => navigate('/superadmin')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <Crown size={14} />
                Superadministrador
              </button>
            </div>

            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          {/* TÍTULO Y SUBTÍTULO - DEBAJO DE LOS BOTONES */}
          <div className="min-w-0 flex-1 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
              Superadministrador
            </h2>
            <p className={`text-xs sm:text-sm ${mutedText}`}>
              Gestión global del sistema UrbanFlow
            </p>
          </div>
        </header>

        <div className="space-y-5 p-4 sm:p-6">
          {loading && (
            <section className={cardBg}>
              <p className="font-medium text-gray-700 dark:text-gray-300">Cargando datos reales del backend...</p>
            </section>
          )}

          {error && (
            <section className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-red-600 dark:text-red-400">
              <p className="font-medium">{error}</p>
            </section>
          )}

          {!loading && !error && dashboard && (
            <>
              {activeSection === 'panel' && (
                <>
                  {/* BIENVENIDA - IGUAL A ADMIN */}
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Bienvenido, {nombreSuperAdmin || 'Superadministrador'} 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                      Gestión global del sistema UrbanFlow
                    </p>
                  </div>

                  {/* TARJETAS EXACTAMENTE IGUALES AL ADMIN DASHBOARD */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                      title="Pendientes"
                      value={pendingCount}
                      icon={AlertTriangle}
                      color="red"
                      subtitle="Sin resolver"
                    />
                    <StatCard
                      title="Total"
                      value={dashboard.resumen.totalReportes}
                      icon={FileText}
                      color="blue"
                      subtitle="Reportes del municipio"
                    />
                    <StatCard
                      title="En proceso"
                      value={enProcesoCount}
                      icon={TrendingUp}
                      color="yellow"
                      subtitle="Gestionándose"
                    />
                    <StatCard
                      title="Resueltos"
                      value={resolvedCount}
                      icon={CheckCircle}
                      color="green"
                      subtitle="Finalizados"
                    />
                  </div>

                  {/* Alerta de críticos */}
                  {criticalCount > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                      Hay {criticalCount} incidente(s) crítico(s) en el sistema.
                    </div>
                  )}

                  {/* Gráficos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-900 text-sm mb-3">
                        Incidentes por categoría
                      </h2>
                      {dashboard.graficos.reportesPorCategoria.length === 0 ? (
                        <p className="text-sm text-gray-400">No hay datos para mostrar.</p>
                      ) : (
                        
<div className="h-72">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      layout="vertical"
      data={categoriasOrdenadas.slice(0, 8)}
      margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis
        type="category"
        dataKey="_id"
        width={120}
      />
      <Tooltip />
      <Bar dataKey="total" radius={[0, 8, 8, 0]}>
        {categoriasOrdenadas.slice(0, 8).map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
                        
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-900 text-sm mb-3">
                        Incidentes por estado
                      </h2>

<div className="h-72">
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      layout="vertical"
      data={estadosOrdenados}
      margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis
        type="category"
        dataKey="_id"
        width={120}
      />
      <Tooltip />
      <Bar dataKey="total" radius={[0, 8, 8, 0]}>
        {estadosOrdenados.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>

                    </div>
                  </div>

                  {/* Mapa de Calor IA - IGUAL A ADMIN */}
                  <div className="mt-5">
                    <IAHeatmap />
                  </div>
                </>
              )}

              {/* Clientes section */}
              {activeSection === 'clientes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Clientes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Organizaciones reales conectadas a UrbanFlow, con localización y acceso directo al mapa.
                  </p>
                <div id="super-clientes-mapa" className="mt-6">
                  <SuperMap
                      clientes={clientes}
                      clienteSeleccionado={clienteSeleccionado}
/>
                </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clientes.map((cliente) => (
                      <article key={cliente._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{cliente.nombre}</h4>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">Activo</span>
                        </div>
                        <p className={`mt-2 text-sm capitalize ${mutedText}`}>{cliente.tipo.replace('_', ' ')}</p>
                        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{cliente.localidad}, {cliente.provincia}, {cliente.pais}</p>
                        
                      <button
                        type="button"
                        onClick={() => {
                          setClienteSeleccionado(cliente._id);
                          document
                           .getElementById("super-clientes-mapa")
                           ?.scrollIntoView({ behavior: "smooth", block: "start" });
                         }}
                         className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Ver georreferencia
                      </button>
                      
                      
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Usuarios section */}
              {activeSection === 'usuarios' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Usuarios y Roles</h3>
                  <p className={`mt-2 ${mutedText}`}>Lectura operativa de usuarios reales registrados en la base.</p>
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-56.25 text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="py-3 text-gray-700 dark:text-gray-300">Usuario</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Email</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Rol</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Cliente</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.slice(0, 50).map((usuario) => (
                          <tr key={usuario._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">{[usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'Sin nombre'}</td>
                            <td className="text-gray-700 dark:text-gray-300">{usuario.email}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{usuario.rol}</td>
                            <td className="text-gray-700 dark:text-gray-300">{usuario.clienteNombre || 'UrbanFlow'}</td>
                            <td><span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">Activo</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Incidentes section */}
              {activeSection === 'incidentes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Centro Operativo de Incidentes</h3>
                  <p className={`mt-2 ${mutedText}`}>Todos los incidentes del sistema por municipio.</p>
                  
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-68.75 text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="py-3 text-gray-700 dark:text-gray-300">Título</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Cliente</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Estado</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Prioridad</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Categoría</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportes.slice(0, 100).map((reporte) => (
                          <tr key={reporte._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">{reporte.titulo}</td>
                            <td className="text-gray-700 dark:text-gray-300">{reporte.clienteNombre || '-'}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{reporte.estado}</td>
                            <td className="capitalize">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reporte.prioridad === 'critica' ? 'bg-red-100 text-red-800' :
                                reporte.prioridad === 'alta' ? 'bg-orange-100 text-orange-800' :
                                reporte.prioridad === 'media' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {reporte.prioridad}
                              </span>
                            </td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{reporte.categoria_asignada_por_ia || 'sin categoría'}</td>
                            <td className="text-gray-700 dark:text-gray-300">{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Informes section */}
              {activeSection === 'informes' && (
                <section className={cardBg}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Informes Ejecutivos
                      </h3>
                      <p className={`mt-2 ${mutedText}`}>
                        Lectura estratégica automática para toma de decisiones.
                      </p>
                    </div>

                    <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                      {criticalCount} críticos activos
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                      <p className="text-sm font-semibold text-red-700">
                        Riesgo principal
                      </p>
                      <h4 className="mt-2 text-3xl font-bold text-red-700">
                        {criticalCount}
                      </h4>
                      <p className="mt-2 text-sm text-red-700">
                        Incidentes críticos requieren atención prioritaria.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                      <p className="text-sm font-semibold text-amber-700">
                        Alta prioridad
                      </p>
                      <h4 className="mt-2 text-3xl font-bold text-amber-700">
                        {highCount}
                      </h4>
                      <p className="mt-2 text-sm text-amber-700">
                        Casos sensibles que pueden escalar si no se gestionan.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                      <p className="text-sm font-semibold text-blue-700">
                        Foco operativo
                      </p>
                      <h4 className="mt-2 text-3xl font-bold text-blue-700 capitalize">
                        {mostFrequentCategory?._id || 'Sin datos'}
                      </h4>
                      <p className="mt-2 text-sm text-blue-700">
                        Categoría dominante con {mostFrequentCategory?.total || 0} reportes.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        Top Riesgos por Categoría
                      </h4>

                      <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={categoriasOrdenadas.slice(0, 6)}
                            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="_id" width={120} />
                            <Tooltip />
                            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                              {categoriasOrdenadas.slice(0, 6).map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        Resumen Ejecutivo IA
                      </h4>

                      <div className="mt-4 space-y-4">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Diagnóstico automático
                          </p>
                          <p className={`mt-2 text-sm ${mutedText}`}>
                            UrbanFlow registra {dashboard.resumen.totalReportes} incidentes.
                            El sistema detecta {criticalCount} casos críticos y {highCount} de alta prioridad.
                          </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            Patrón dominante
                          </p>
                          <p className={`mt-2 text-sm ${mutedText}`}>
                            La categoría con mayor concentración es {mostFrequentCategory?._id || 'sin datos'},
                            con {mostFrequentCategory?.total || 0} reportes acumulados.
                          </p>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                          <p className="text-sm font-bold text-blue-800">
                            Recomendación operativa
                          </p>
                          <p className="mt-2 text-sm text-blue-800">
                            Priorizar incidentes críticos, reforzar operadores en zonas calientes
                            y monitorear categorías recurrentes durante las próximas 24 horas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Analitica section */}
              {activeSection === 'analitica' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Analítica Inteligente
                  </h3>

                  <p className={`mt-2 ${mutedText}`}>
                    Distribución estratégica de incidentes.
                  </p>

                  <div className="mt-6 grid gap-6 xl:grid-cols-2">

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                      <h4 className="font-bold mb-4">
                        Incidentes por Categoría
                      </h4>

                      <div className="h-105">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            layout="vertical"
                            data={categoriasOrdenadas}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 30,
                              bottom: 10,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="_id" width={120} />
                            <Tooltip />
                            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                              {categoriasOrdenadas.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                      <h4 className="font-bold mb-4">
                        Prioridades
                      </h4>

                      <div className="h-105">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={dashboard.graficos.reportesPorPrioridad}
                              dataKey="total"
                              nameKey="_id"
                              innerRadius={80}
                              outerRadius={140}
                              label
                            >
                              {dashboard.graficos.reportesPorPrioridad.map(
                                (_, index) => (
                                  <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </section>
              )}

              {/* Configuracion section */}
              {activeSection === 'configuracion' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Estado del Sistema
                  </h3>

                  <p className={`mt-2 ${mutedText}`}>
                    Monitoreo operativo en tiempo real.
                  </p>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-semibold">Backend</span>
                      </div>
                      <h4 className="mt-3 text-2xl font-bold">Conectado</h4>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-semibold">MongoDB Atlas</span>
                      </div>
                      <h4 className="mt-3 text-2xl font-bold">Operativo</h4>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-semibold">IA Gemini</span>
                      </div>
                      <h4 className="mt-3 text-2xl font-bold">Activa</h4>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                      <p className="font-semibold">Hora del Sistema</p>
                      <h4 className="mt-2 text-xl font-bold">
                        {currentTime.toLocaleTimeString()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {currentTime.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-gray-500">Incidentes</p>
                      <h4 className="text-3xl font-bold">
                        {dashboard.resumen?.totalReportes || 0}
                      </h4>
                    </div>

                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-gray-500">Usuarios</p>
                      <h4 className="text-3xl font-bold">
                        {usuarios.length}
                      </h4>
                    </div>

                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-gray-500">Clientes</p>
                      <h4 className="text-3xl font-bold">
                        {clientes.length}
                      </h4>
                    </div>

                    <div className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-gray-500">Disponibilidad</p>
                      <h4 className="text-3xl font-bold text-green-600">
                        99.9%
                      </h4>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}