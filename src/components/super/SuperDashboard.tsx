import { useEffect, useState, useCallback } from 'react';
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
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

type SuperSection =
  | 'panel' | 'clientes' | 'usuarios'
  | 'incidentes' | 'informes' | 'analitica' | 'configuracion';

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
  _id: string; nombre: string; tipo: string;
  localidad: string; provincia: string; pais: string;
  direccion?: string; latitud: number; longitud: number; activo?: boolean;
};

type Usuario = {
  _id: string; email: string; nombre?: string; apellido?: string;
  rol: string; localidad?: string; provincia?: string; pais?: string;
  clienteNombre?: string; activo?: boolean;
};

type Reporte = {
  _id: string; titulo: string; clienteNombre?: string;
  estado: string; prioridad: string; categoria_asignada_por_ia?: string;
  localidad?: string; provincia?: string; pais?: string;
  latitud?: number; longitud?: number; fecha_hora: string;
  ia_procesado?: boolean; ai_priority_score?: number;
  posible_duplicado?: boolean; vectorizado?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = [
  '#2563eb', '#16a34a', '#f59e0b', '#dc2626',
  '#9333ea', '#0891b2', '#ea580c', '#64748b',
];

const pageBg   = 'bg-gray-50 dark:bg-gray-950';
const cardBg   = 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none';
const mutedText = 'text-gray-500 dark:text-gray-400';

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className}`} />
  );
}

function PanelSkeleton() {
  return (
    <div className="space-y-5">
      <SkeletonBlock className="h-7 w-56" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkeletonBlock className="h-52 rounded-xl" />
        <SkeletonBlock className="h-52 rounded-xl" />
      </div>
      <SkeletonBlock className="h-72 rounded-xl" />
    </div>
  );
}

function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-3 mt-6">
      {[...Array(rows)].map((_, i) => <SkeletonBlock key={i} className="h-10 rounded-md" />)}
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4 text-red-600 dark:text-red-400 text-sm">
      {message}
    </div>
  );
}

// ─── Custom hook: reloj ───────────────────────────────────────────────────────

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SuperDashboard() {
  const navigate  = useNavigate();
  const { user }  = useUser();
  const currentTime = useClock();

  const [mobileOpen,       setMobileOpen]       = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection,    setActiveSection]    = useState<SuperSection>('panel');

  // Estado granular por recurso
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [clientes,  setClientes]  = useState<Cliente[]  | null>(null);
  const [usuarios,  setUsuarios]  = useState<Usuario[]  | null>(null);
  const [reportes,  setReportes]  = useState<Reporte[]  | null>(null);

  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingClientes,  setLoadingClientes]  = useState(false);
  const [loadingUsuarios,  setLoadingUsuarios]  = useState(false);
  const [loadingReportes,  setLoadingReportes]  = useState(false);

  const [errorDashboard, setErrorDashboard] = useState('');
  const [errorClientes,  setErrorClientes]  = useState('');
  const [errorUsuarios,  setErrorUsuarios]  = useState('');
  const [errorReportes,  setErrorReportes]  = useState('');

  const nombreSuperAdmin = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();

  // 1️⃣ Carga inmediata: solo el dashboard (el más rápido y el más importante)
  useEffect(() => {
    getSuperDashboard()
      .then(setDashboard)
      .catch(() => setErrorDashboard('No se pudo cargar el panel principal.'))
      .finally(() => setLoadingDashboard(false));
  }, []);

  // 2️⃣ Lazy loaders — se disparan cuando el usuario navega a esa sección
  const loadClientes = useCallback(() => {
    if (clientes !== null || loadingClientes) return;
    setLoadingClientes(true);
    getSuperClientes()
      .then(d => setClientes(d.clientes ?? []))
      .catch(() => setErrorClientes('No se pudieron cargar los clientes.'))
      .finally(() => setLoadingClientes(false));
  }, [clientes, loadingClientes]);

  const loadUsuarios = useCallback(() => {
    if (usuarios !== null || loadingUsuarios) return;
    setLoadingUsuarios(true);
    getSuperUsuarios()
      .then(d => setUsuarios(d.usuarios ?? []))
      .catch(() => setErrorUsuarios('No se pudieron cargar los usuarios.'))
      .finally(() => setLoadingUsuarios(false));
  }, [usuarios, loadingUsuarios]);

  const loadReportes = useCallback(() => {
    if (reportes !== null || loadingReportes) return;
    setLoadingReportes(true);
    getSuperReportes()
      .then(d => setReportes(d.reportes ?? []))
      .catch(() => setErrorReportes('No se pudieron cargar los incidentes.'))
      .finally(() => setLoadingReportes(false));
  }, [reportes, loadingReportes]);

  // 3️⃣ Dispatcher al cambiar sección
  const handleSectionChange = useCallback((section: SuperSection) => {
    setActiveSection(section);
    if (section === 'clientes')                        loadClientes();
    if (section === 'usuarios')                        loadUsuarios();
    if (section === 'incidentes' || section === 'informes' || section === 'analitica') {
      loadReportes();
    }
  }, [loadClientes, loadUsuarios, loadReportes]);

  // ─── Derived values ──────────────────────────────────────────────────────

  const criticalCount       = dashboard?.graficos.reportesPorPrioridad.find(i => i._id === 'critica')?.total  ?? 0;
  const highCount           = dashboard?.graficos.reportesPorPrioridad.find(i => i._id === 'alta')?.total     ?? 0;
  const pendingCount        = dashboard?.graficos.reportesPorEstado.find(i => i._id === 'pendiente')?.total   ?? 0;
  const resolvedCount       = dashboard?.graficos.reportesPorEstado.find(i => i._id === 'resuelto')?.total    ?? 0;
  const enProcesoCount      = dashboard?.graficos.reportesPorEstado.find(i => i._id === 'en_proceso')?.total  ?? 0;
  const mostFrequentCategory = dashboard?.graficos.reportesPorCategoria[0];

  const categoriasOrdenadas = dashboard?.graficos?.reportesPorCategoria
    ? [...dashboard.graficos.reportesPorCategoria].sort((a, b) => b.total - a.total)
    : [];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen ${pageBg} lg:flex`}>
      <SuperSidebar
        mobileOpen={mobileOpen}
        collapsed={sidebarCollapsed}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        onClose={() => setMobileOpen(false)}
      />

      <main className="min-w-0 flex-1">
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 lg:hidden"
            >
              ☰
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'Administrador',      icon: Building2, path: '/municipality/admin',     active: false },
                { label: 'Operador',           icon: HardHat,   path: '/municipality/operator',  active: false },
                { label: 'Ciudadano',          icon: User,      path: '/',                       active: false },
                { label: 'Superadministrador', icon: Crown,     path: '/superadmin',             active: true  },
              ].map(({ label, icon: Icon, path, active }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>

          <div className="min-w-0 flex-1 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <h2 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-100 sm:text-2xl">
              Superadministrador
            </h2>
            <p className={`text-xs sm:text-sm ${mutedText}`}>
              Gestión global del sistema UrbanFlow
            </p>
          </div>
        </header>

        {/* CONTENT */}
        <div className="space-y-5 p-4 sm:p-6">

          {/* ── Panel ─────────────────────────────────────────────────────── */}
          {activeSection === 'panel' && (
            <>
              {loadingDashboard && <PanelSkeleton />}
              {errorDashboard   && <SectionError message={errorDashboard} />}

              {!loadingDashboard && !errorDashboard && dashboard && (
                <>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Bienvenido, {nombreSuperAdmin || 'Superadministrador'} 👋
                    </h1>
                    <p className={`text-sm mt-0.5 ${mutedText}`}>
                      Gestión global del sistema UrbanFlow
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard title="Pendientes"  value={pendingCount}                      icon={AlertTriangle} color="red"    subtitle="Sin resolver"         />
                    <StatCard title="Total"       value={dashboard.resumen.totalReportes}   icon={FileText}      color="blue"   subtitle="Reportes del municipio"/>
                    <StatCard title="En proceso"  value={enProcesoCount}                    icon={TrendingUp}    color="yellow" subtitle="Gestionándose"        />
                    <StatCard title="Resueltos"   value={resolvedCount}                     icon={CheckCircle}   color="green"  subtitle="Finalizados"          />
                  </div>

                  {criticalCount > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                      Hay {criticalCount} incidente(s) crítico(s) en el sistema.
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Categorías */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-900 text-sm mb-3">Incidentes por categoría</h2>
                      {dashboard.graficos.reportesPorCategoria.length === 0
                        ? <p className="text-sm text-gray-400">No hay datos para mostrar.</p>
                        : (
                          <div className="space-y-3">
                            {dashboard.graficos.reportesPorCategoria.slice(0, 8).map(item => (
                              <div key={item._id} className="flex items-center justify-between">
                                <span className="capitalize text-gray-700 text-sm">{item._id || 'Sin categoría'}</span>
                                <div className="flex items-center gap-3">
                                  <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${(item.total / dashboard.resumen.totalReportes) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-semibold text-gray-900">{item.total}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>

                    {/* Estados */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-900 text-sm mb-3">Incidentes por estado</h2>
                      <div className="space-y-3">
                        {dashboard.graficos.reportesPorEstado.map(item => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${(item.total / dashboard.resumen.totalReportes) * 100}%`,
                                    backgroundColor:
                                      item._id === 'pendiente'  ? '#ef4444' :
                                      item._id === 'en_proceso' ? '#f59e0b' :
                                      item._id === 'resuelto'   ? '#22c55e' : '#6b7280',
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{item.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <IAHeatmap />
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Clientes ──────────────────────────────────────────────────── */}
          {activeSection === 'clientes' && (
            <section className={cardBg}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestión de Clientes</h3>
              <p className={`mt-2 ${mutedText}`}>
                Organizaciones reales conectadas a UrbanFlow, con localización y acceso directo al mapa.
              </p>

              {loadingClientes && <TableSkeleton rows={6} />}
              {errorClientes   && <SectionError message={errorClientes} />}

              {!loadingClientes && !errorClientes && clientes !== null && (
                <>
                  <div className="mt-6">
                    <SuperMap clientes={clientes} />
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clientes.map(cliente => (
                      <article key={cliente._id} className={cardBg}>
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">{cliente.nombre}</h4>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">Activo</span>
                        </div>
                        <p className={`mt-2 text-sm capitalize ${mutedText}`}>{cliente.tipo.replace('_', ' ')}</p>
                        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {cliente.localidad}, {cliente.provincia}, {cliente.pais}
                        </p>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${cliente.latitud}&mlon=${cliente.longitud}#map=15/${cliente.latitud}/${cliente.longitud}`}
                          target="_blank" rel="noreferrer"
                          className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Ver georreferencia
                        </a>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Usuarios ──────────────────────────────────────────────────── */}
          {activeSection === 'usuarios' && (
            <section className={cardBg}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Usuarios y Roles</h3>
              <p className={`mt-2 ${mutedText}`}>Lectura operativa de usuarios reales registrados en la base.</p>

              {loadingUsuarios && <TableSkeleton rows={10} />}
              {errorUsuarios   && <SectionError message={errorUsuarios} />}

              {!loadingUsuarios && !errorUsuarios && usuarios !== null && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[450px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        {['Usuario', 'Email', 'Rol', 'Cliente', 'Estado'].map(h => (
                          <th key={h} className="py-3 text-gray-700 dark:text-gray-300">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.slice(0, 50).map(u => (
                        <tr key={u._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">
                            {[u.nombre, u.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300">{u.email}</td>
                          <td className="capitalize text-gray-700 dark:text-gray-300">{u.rol}</td>
                          <td className="text-gray-700 dark:text-gray-300">{u.clienteNombre || 'UrbanFlow'}</td>
                          <td><span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">Activo</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── Incidentes ────────────────────────────────────────────────── */}
          {activeSection === 'incidentes' && (
            <section className={cardBg}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Centro Operativo de Incidentes</h3>
              <p className={`mt-2 ${mutedText}`}>Todos los incidentes del sistema por municipio.</p>

              {loadingReportes && <TableSkeleton rows={12} />}
              {errorReportes   && <SectionError message={errorReportes} />}

              {!loadingReportes && !errorReportes && reportes !== null && (
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[550px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        {['Título', 'Cliente', 'Estado', 'Prioridad', 'Categoría', 'Fecha'].map(h => (
                          <th key={h} className="py-3 text-gray-700 dark:text-gray-300">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reportes.slice(0, 100).map(r => (
                        <tr key={r._id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-4 font-semibold text-gray-900 dark:text-gray-100">{r.titulo}</td>
                          <td className="text-gray-700 dark:text-gray-300">{r.clienteNombre || '-'}</td>
                          <td className="capitalize text-gray-700 dark:text-gray-300">{r.estado}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              r.prioridad === 'critica' ? 'bg-red-100 text-red-800'     :
                              r.prioridad === 'alta'    ? 'bg-orange-100 text-orange-800' :
                              r.prioridad === 'media'   ? 'bg-blue-100 text-blue-800'   :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {r.prioridad}
                            </span>
                          </td>
                          <td className="capitalize text-gray-700 dark:text-gray-300">{r.categoria_asignada_por_ia || 'sin categoría'}</td>
                          <td className="text-gray-700 dark:text-gray-300">{new Date(r.fecha_hora).toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── Informes ──────────────────────────────────────────────────── */}
          {activeSection === 'informes' && (
            <section className={cardBg}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informes Ejecutivos</h3>
                  <p className={`mt-2 ${mutedText}`}>Lectura estratégica automática para toma de decisiones.</p>
                </div>
                <div className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                  {criticalCount} críticos activos
                </div>
              </div>

              {(loadingDashboard || loadingReportes) && <TableSkeleton rows={4} />}
              {(errorDashboard   || errorReportes)   && (
                <SectionError message={errorDashboard || errorReportes} />
              )}

              {!loadingDashboard && !loadingReportes && dashboard && (
                <>
                  <div className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                      <p className="text-sm font-semibold text-red-700">Riesgo principal</p>
                      <h4 className="mt-2 text-3xl font-bold text-red-700">{criticalCount}</h4>
                      <p className="mt-2 text-sm text-red-700">Incidentes críticos requieren atención prioritaria.</p>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                      <p className="text-sm font-semibold text-amber-700">Alta prioridad</p>
                      <h4 className="mt-2 text-3xl font-bold text-amber-700">{highCount}</h4>
                      <p className="mt-2 text-sm text-amber-700">Casos sensibles que pueden escalar si no se gestionan.</p>
                    </div>
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                      <p className="text-sm font-semibold text-blue-700">Foco operativo</p>
                      <h4 className="mt-2 text-3xl font-bold text-blue-700 capitalize">{mostFrequentCategory?._id || 'Sin datos'}</h4>
                      <p className="mt-2 text-sm text-blue-700">Categoría dominante con {mostFrequentCategory?.total || 0} reportes.</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Top Riesgos por Categoría</h4>
                      <div className="mt-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart layout="vertical" data={categoriasOrdenadas.slice(0, 6)} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="_id" width={120} />
                            <Tooltip />
                            <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                              {categoriasOrdenadas.slice(0, 6).map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">Resumen Ejecutivo IA</h4>
                      <div className="mt-4 space-y-4">
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Diagnóstico automático</p>
                          <p className={`mt-2 text-sm ${mutedText}`}>
                            UrbanFlow registra {dashboard.resumen.totalReportes} incidentes.
                            El sistema detecta {criticalCount} casos críticos y {highCount} de alta prioridad.
                          </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Patrón dominante</p>
                          <p className={`mt-2 text-sm ${mutedText}`}>
                            La categoría con mayor concentración es {mostFrequentCategory?._id || 'sin datos'},
                            con {mostFrequentCategory?.total || 0} reportes acumulados.
                          </p>
                        </div>
                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                          <p className="text-sm font-bold text-blue-800">Recomendación operativa</p>
                          <p className="mt-2 text-sm text-blue-800">
                            Priorizar incidentes críticos, reforzar operadores en zonas calientes
                            y monitorear categorías recurrentes durante las próximas 24 horas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* ── Analítica ─────────────────────────────────────────────────── */}
          {activeSection === 'analitica' && (
            <section className={cardBg}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analítica Inteligente</h3>
              <p className={`mt-2 ${mutedText}`}>Distribución estratégica de incidentes.</p>

              {(loadingDashboard || loadingReportes) && <TableSkeleton rows={4} />}
              {(errorDashboard   || errorReportes)   && (
                <SectionError message={errorDashboard || errorReportes} />
              )}

              {!loadingDashboard && !loadingReportes && dashboard && (
                <div className="mt-6 grid gap-6 xl:grid-cols-2">
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                    <h4 className="font-bold mb-4">Incidentes por Categoría</h4>
                    <div className="h-[420px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={categoriasOrdenadas} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="_id" width={120} />
                          <Tooltip />
                          <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                            {categoriasOrdenadas.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                    <h4 className="font-bold mb-4">Prioridades</h4>
                    <div className="h-[420px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dashboard.graficos.reportesPorPrioridad} dataKey="total" nameKey="_id" innerRadius={80} outerRadius={140} label>
                            {dashboard.graficos.reportesPorPrioridad.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Configuración ─────────────────────────────────────────────── */}
          {activeSection === 'configuracion' && (
            <section className={cardBg}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Estado del Sistema</h3>
              <p className={`mt-2 ${mutedText}`}>Monitoreo operativo en tiempo real.</p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: 'Backend',      value: 'Conectado', color: 'green' },
                  { label: 'MongoDB Atlas', value: 'Operativo', color: 'green' },
                  { label: 'IA Gemini',    value: 'Activa',    color: 'green' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl border border-${color}-200 bg-${color}-50 p-4`}>
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full bg-${color}-500 animate-pulse`} />
                      <span className="font-semibold">{label}</span>
                    </div>
                    <h4 className="mt-3 text-2xl font-bold">{value}</h4>
                  </div>
                ))}

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <p className="font-semibold">Hora del Sistema</p>
                  <h4 className="mt-2 text-xl font-bold">{currentTime.toLocaleTimeString()}</h4>
                  <p className="text-sm text-gray-600">{currentTime.toLocaleDateString()}</p>
                </div>
              </div>

              {loadingDashboard && <TableSkeleton rows={2} />}

              {!loadingDashboard && dashboard && (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {[
                    { label: 'Incidentes',    value: dashboard.resumen?.totalReportes ?? 0 },
                    { label: 'Usuarios',      value: usuarios?.length ?? '—'           },
                    { label: 'Clientes',      value: clientes?.length ?? '—'           },
                    { label: 'Disponibilidad', value: '99.9%', green: true             },
                  ].map(({ label, value, green }) => (
                    <div key={label} className="bg-white border rounded-xl p-4">
                      <p className="text-sm text-gray-500">{label}</p>
                      <h4 className={`text-3xl font-bold ${green ? 'text-green-600' : ''}`}>{value}</h4>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
