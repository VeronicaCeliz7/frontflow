import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import SuperSidebar from './SuperSidebar';
import SuperMap from './SuperMap';
import { Crown, Building2, HardHat, User } from 'lucide-react';
import IAHeatmap from '../IAHeatmap'

import {
  getSuperDashboard,
  getSuperClientes,
  getSuperUsuarios,
  getSuperReportes,
} from '../../Services/superApi';

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

  reporte_duplicado_id?: string | null;

  duplicado_score?: number;

  duplicado_distancia_metros?: number | null;

  proveedor_ia?: string;

  modelo_ia?: string;

  vectorizado?: boolean;

  vector_modelo?: string | null;
};

export default function SuperDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<SuperSection>('panel');

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboardData, clientesData, usuariosData, reportesData] =
          await Promise.all([
            getSuperDashboard(),
            getSuperClientes(),
            getSuperUsuarios(),
            getSuperReportes(),
          ]);

        setDashboard(dashboardData);
        setClientes(clientesData.clientes || []);
        setUsuarios(usuariosData.usuarios || []);
        setReportes(reportesData.reportes || []);
      } catch {
        setError('No se pudo conectar con el backend.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Estilos shadcn con modo oscuro
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
  const resolutionRate = dashboard?.resumen.totalReportes
    ? Math.round((resolvedCount / dashboard.resumen.totalReportes) * 100)
    : 0;
  const mostFrequentCategory = dashboard?.graficos.reportesPorCategoria[0];

  const stats = [
    { title: 'Clientes', value: dashboard?.resumen.totalClientes ?? 0, subtitle: 'Organizaciones activas', icon: '🏛️', section: 'clientes' as SuperSection },
    { title: 'Usuarios', value: dashboard?.resumen.totalUsuarios ?? 0, subtitle: 'Usuarios totales', icon: '👥', section: 'usuarios' as SuperSection },
    { title: 'Ciudadanos', value: dashboard?.resumen.totalCiudadanos ?? 0, subtitle: 'Usuarios ciudadanos', icon: '🧑‍🤝‍🧑', section: 'usuarios' as SuperSection },
    { title: 'Incidentes', value: dashboard?.resumen.totalReportes ?? 0, subtitle: 'Reportes registrados', icon: '📍', section: 'incidentes' as SuperSection },
  ];

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
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 lg:hidden"
            >
              ☰
            </button>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
                Centro de Decisión UrbanFlow
              </h2>
              <p className={`text-xs sm:text-sm ${mutedText}`}>
                Datos reales para gestión urbana inteligente
              </p>
            </div>
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Menú de navegación entre roles */}
        <div className="px-4 sm:px-6">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
            <button
              onClick={() => navigate('/superadmin')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition flex items-center gap-2 ${
                window.location.pathname.startsWith('/superadmin')
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Crown size={16} />
              Superadmin
            </button>
            <button
              onClick={() => navigate('/municipality/admin')}
              className="rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Building2 size={16} />
              Admin
            </button>
            <button
              onClick={() => navigate('/municipality/operator')}
              className="rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <HardHat size={16} />
              Operador
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="rounded-md bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <User size={16} />
              Ciudadano
            </button>
          </div>
        </div>

        <div className="space-y-6 p-4 sm:p-6">
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
                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => setActiveSection(item.section)}
                        className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-left shadow-none transition hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {item.title}
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{item.value}</h3>
                            <p className={`mt-1 text-xs ${mutedText}`}>{item.subtitle}</p>
                          </div>
                          <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-2xl text-white">
                            {item.icon}
                          </div>
                        </div>
                      </button>
                    ))}
                  </section>

                  <section className="grid gap-4 lg:grid-cols-4">
                    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 shadow-none">
                      <p className="text-sm font-bold text-red-800 dark:text-red-400">Críticos</p>
                      <h3 className="mt-2 text-3xl font-black text-red-900 dark:text-red-300">{criticalCount}</h3>
                      <p className="mt-1 text-xs text-red-700 dark:text-red-500">Atención inmediata</p>
                    </div>
                    <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4 shadow-none">
                      <p className="text-sm font-bold text-orange-800 dark:text-orange-400">Alta prioridad</p>
                      <h3 className="mt-2 text-3xl font-black text-orange-900 dark:text-orange-300">{highCount}</h3>
                      <p className="mt-1 text-xs text-orange-700 dark:text-orange-500">Requieren seguimiento</p>
                    </div>
                    <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 p-4 shadow-none">
                      <p className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Pendientes</p>
                      <h3 className="mt-2 text-3xl font-black text-yellow-900 dark:text-yellow-300">{pendingCount}</h3>
                      <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-500">Backlog operativo</p>
                    </div>
                    <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 shadow-none">
                      <p className="text-sm font-bold text-green-800 dark:text-green-400">Resolución</p>
                      <h3 className="mt-2 text-3xl font-black text-green-900 dark:text-green-300">{resolutionRate}%</h3>
                      <p className="mt-1 text-xs text-green-700 dark:text-green-500">Reportes resueltos</p>
                    </div>
                  </section>

<section className="mt-6">
  <IAHeatmap />
</section>

<section className="mt-6 grid gap-6 xl:grid-cols-3">

                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reportes por estado</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Reportes por prioridad</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Categorías IA</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 6).map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id || 'sin categoría'}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeSection === 'clientes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Clientes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Organizaciones reales conectadas a UrbanFlow, con localización y acceso directo al mapa.
                  </p>
                  <div className="mt-6">
                    <SuperMap clientes={clientes} />
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clientes.map((cliente) => (
                      <article key={cliente._id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{cliente.nombre}</h4>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                            Activo
                          </span>
                        </div>
                        <p className={`mt-2 text-sm capitalize ${mutedText}`}>
                          {cliente.tipo.replace('_', ' ')}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {cliente.localidad}, {cliente.provincia}, {cliente.pais}
                        </p>
                        <p className={`mt-2 text-xs ${mutedText}`}>
                          Lat: {cliente.latitud} · Lng: {cliente.longitud}
                        </p>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${cliente.latitud}&mlon=${cliente.longitud}#map=15/${cliente.latitud}/${cliente.longitud}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Ver georreferencia
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'usuarios' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Usuarios y Roles</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Lectura operativa de usuarios reales registrados en la base.
                  </p>
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[225px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="py-3 text-gray-700 dark:text-gray-300">Usuario</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Email</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Rol</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Cliente</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Localidad</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.slice(0, 80).map((usuario) => (
                          <tr key={usuario._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">
                              {[usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                            </td>
                            <td className="text-gray-700 dark:text-gray-300">{usuario.email}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{usuario.rol}</td>
                            <td className="text-gray-700 dark:text-gray-300">{usuario.clienteNombre || 'UrbanFlow'}</td>
                            <td className="text-gray-700 dark:text-gray-300">{usuario.localidad || '-'}</td>
                            <td>
                              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                                {usuario.activo === false ? 'Inactivo' : 'Activo'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'incidentes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Centro Operativo de Incidentes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Incidentes reales con prioridad, estado, categoría y georreferencia operativa.
                  </p>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
                    <p className="text-xs text-indigo-300 font-semibold">IA procesó</p>
                    <p className="mt-2 text-3xl font-bold text-gray-100">
                      {reportes.filter((r) => r.ia_procesado).length}
                    </p>
                    <p className="text-xs text-gray-400">Incidentes enriquecidos</p>
                  </div>

                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                    <p className="text-xs text-red-300 font-semibold">Críticos IA</p>
                    <p className="mt-2 text-3xl font-bold text-gray-100">
                      {reportes.filter((r) => r.prioridad === 'critica' || r.prioridad === 'crítica').length}
                    </p>
                    <p className="text-xs text-gray-400">Atención inmediata</p>
                  </div>

                  <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                    <p className="text-xs text-purple-300 font-semibold">Duplicados IA</p>
                    <p className="mt-2 text-3xl font-bold text-gray-100">
                      {reportes.filter((r) => r.posible_duplicado).length}
                    </p>
                    <p className="text-xs text-gray-400">Agrupación inteligente</p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <p className="text-xs text-emerald-300 font-semibold">Vectorizados</p>
                    <p className="mt-2 text-3xl font-bold text-gray-100">
                      {reportes.filter((r) => r.vectorizado).length}
                    </p>
                    <p className="text-xs text-gray-400">Motor semántico futuro</p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-gray-700 bg-gray-900/40 p-4">
                  <p className="text-sm font-semibold text-gray-100">
                    Motor IA UrbanFlow
                  </p>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg bg-gray-800/70 p-3">
                      <p className="text-gray-400">Proveedor IA</p>
                      <p className="mt-1 font-semibold text-gray-100">
                        Gemini + fallback local
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-800/70 p-3">
                      <p className="text-gray-400">Estado</p>
                      <p className="mt-1 font-semibold text-emerald-300">
                        Operativo y resiliente
                      </p>
                    </div>

                    <div className="rounded-lg bg-gray-800/70 p-3">
                      <p className="text-gray-400">Próxima evolución</p>
                      <p className="mt-1 font-semibold text-indigo-300">
                        Embeddings + mapas de calor
                      </p>
                    </div>
                  </div>
                </div>
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[275px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="py-3 text-gray-700 dark:text-gray-300">Título</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Cliente</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Estado</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Prioridad</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Categoría</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Motor IA</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Localidad</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Fecha</th>
                          <th className="py-3 text-gray-700 dark:text-gray-300">Mapa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportes.slice(0, 100).map((reporte) => (
                          <tr key={reporte._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">{reporte.titulo}</td>
                            <td className="text-gray-700 dark:text-gray-300">{reporte.clienteNombre || '-'}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{reporte.estado}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{reporte.prioridad}</td>
                            <td className="capitalize text-gray-700 dark:text-gray-300">{reporte.categoria_asignada_por_ia || 'sin categoría'}</td>
                            <td className="text-gray-700 dark:text-gray-300">
                            <div className="flex flex-col gap-1 text-xs min-w-[140px]">
                              <span className="rounded bg-indigo-100 px-2 py-1 font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                                Score {reporte.ai_priority_score ?? 0}/100
                              </span>

                              {reporte.posible_duplicado && (
                                <span className="rounded bg-purple-100 px-2 py-1 font-medium text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                                  Duplicado
                                  {typeof reporte.duplicado_distancia_metros === 'number'
                                    ? ` · ${reporte.duplicado_distancia_metros} m`
                                    : ''}
                                </span>
                              )}

                              <span className="rounded bg-gray-100 px-2 py-1 font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {reporte.vectorizado ? 'Vectorizado' : 'Vector pendiente'}
                              </span>
                            </div>
                          </td>
                            <td className="text-gray-700 dark:text-gray-300">{reporte.localidad || '-'}</td>
                            <td className="text-gray-700 dark:text-gray-300">{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
                            <td>
                              {reporte.latitud && reporte.longitud ? (
                                <a
                                  href={`https://www.openstreetmap.org/?mlat=${reporte.latitud}&mlon=${reporte.longitud}#map=16/${reporte.latitud}/${reporte.longitud}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                >
                                  Ver
                                </a>
                              ) : (
                                '-'
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeSection === 'informes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informes Ejecutivos</h3>
                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Situación actual</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Hay {dashboard.resumen.totalReportes} incidentes registrados, con{' '}
                        {criticalCount + highCount} casos de prioridad alta o crítica.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Foco operativo</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        La categoría más frecuente es {mostFrequentCategory?._id || 'sin datos'},
                        con {mostFrequentCategory?.total || 0} reportes.
                      </p>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Recomendación</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Priorizar incidentes críticos, pendientes y zonas con acumulación de reportes.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'analitica' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analítica Inteligente</h3>
                  <p className={`mt-2 ${mutedText}`}>Lectura comparativa para detectar saturación operativa.</p>
                  <div className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Estados</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Prioridades</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-none">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Categorías</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 8).map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id || 'sin categoría'}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'configuracion' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración del Sistema</h3>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Conectado</h4>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">MongoDB Atlas</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Operativo</h4>
                    </div>
                    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">IA</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Próximo paso</h4>
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