import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import SuperSidebar from './SuperSidebar';
import SuperMap from './SuperMap';

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
};

export default function SuperDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<SuperSection>('panel');

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reportes, setReportes] = useState<Reporte[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

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

  const pageBg = isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-950';
  const headerBg = isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90';
  const cardBg = isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-950';
  const softCardBg = isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

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
    {
      title: 'Clientes',
      value: dashboard?.resumen.totalClientes ?? 0,
      subtitle: 'Organizaciones activas',
      icon: '🏛️',
      section: 'clientes' as SuperSection,
    },
    {
      title: 'Usuarios',
      value: dashboard?.resumen.totalUsuarios ?? 0,
      subtitle: 'Usuarios totales',
      icon: '👥',
      section: 'usuarios' as SuperSection,
    },
    {
      title: 'Ciudadanos',
      value: dashboard?.resumen.totalCiudadanos ?? 0,
      subtitle: 'Usuarios ciudadanos',
      icon: '🧑‍🤝‍🧑',
      section: 'usuarios' as SuperSection,
    },
    {
      title: 'Incidentes',
      value: dashboard?.resumen.totalReportes ?? 0,
      subtitle: 'Reportes registrados',
      icon: '📍',
      section: 'incidentes' as SuperSection,
    },
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
        <header className={`sticky top-0 z-20 border-b px-4 py-4 backdrop-blur sm:px-6 ${headerBg}`}>
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border border-slate-300 px-3 py-2 font-black lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-black sm:text-2xl">
                Centro de Decisión UrbanFlow
              </h2>
              <p className={`text-xs sm:text-sm ${mutedText}`}>
                Datos reales para gestión urbana inteligente
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`rounded-xl border px-4 py-2 text-lg font-bold transition ${
                  isDark
                    ? 'border-slate-700 bg-slate-900 hover:bg-slate-800'
                    : 'border-slate-300 bg-white hover:bg-slate-100'
                }`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>

              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        <div className="space-y-6 p-4 sm:p-6">
          {loading && (
            <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
              <p className="font-bold">Cargando datos reales del backend...</p>
            </section>
          )}

          {error && (
            <section className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700 shadow-sm">
              <p className="font-bold">{error}</p>
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
                        className={`rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${cardBg}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className={`text-sm font-bold ${isDark ? 'text-blue-200' : 'text-violet-700'}`}>
                              {item.title}
                            </p>
                            <h3 className="mt-2 text-3xl font-black">{item.value}</h3>
                            <p className={`mt-1 text-xs ${mutedText}`}>{item.subtitle}</p>
                          </div>

                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-700 text-2xl">
                            {item.icon}
                          </div>
                        </div>
                      </button>
                    ))}
                  </section>

                  <section className="grid gap-4 lg:grid-cols-4">
                    <div className="rounded-2xl bg-red-600 p-5 text-white shadow-sm">
                      <p className="text-sm font-bold">Críticos</p>
                      <h3 className="mt-2 text-3xl font-black">{criticalCount}</h3>
                      <p className="mt-1 text-xs text-red-100">Atención inmediata</p>
                    </div>

                    <div className="rounded-2xl bg-orange-500 p-5 text-white shadow-sm">
                      <p className="text-sm font-bold">Alta prioridad</p>
                      <h3 className="mt-2 text-3xl font-black">{highCount}</h3>
                      <p className="mt-1 text-xs text-orange-100">Requieren seguimiento</p>
                    </div>

                    <div className="rounded-2xl bg-yellow-500 p-5 text-slate-950 shadow-sm">
                      <p className="text-sm font-bold">Pendientes</p>
                      <h3 className="mt-2 text-3xl font-black">{pendingCount}</h3>
                      <p className="mt-1 text-xs">Backlog operativo</p>
                    </div>

                    <div className="rounded-2xl bg-emerald-600 p-5 text-white shadow-sm">
                      <p className="text-sm font-bold">Resolución</p>
                      <h3 className="mt-2 text-3xl font-black">{resolutionRate}%</h3>
                      <p className="mt-1 text-xs text-emerald-100">Reportes resueltos</p>
                    </div>
                  </section>

                  <section className="grid gap-6 xl:grid-cols-3">
                    <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                      <h3 className="text-lg font-black">Reportes por estado</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize">{item._id}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                      <h3 className="text-lg font-black">Reportes por prioridad</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize">{item._id}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                      <h3 className="text-lg font-black">Categorías IA</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 6).map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize">{item._id || 'sin categoría'}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeSection === 'clientes' && (
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Gestión de Clientes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Organizaciones reales conectadas a UrbanFlow, con localización y acceso directo al mapa.
                  </p>

                  <div className="mt-6">
                  <SuperMap clientes={clientes} />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clientes.map((cliente) => (
                      <article key={cliente._id} className={`rounded-2xl border p-5 ${softCardBg}`}>
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-black">{cliente.nombre}</h4>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                            Activo
                          </span>
                        </div>

                        <p className={`mt-2 text-sm capitalize ${mutedText}`}>
                          {cliente.tipo.replace('_', ' ')}
                        </p>

                        <p className="mt-3 text-sm font-semibold">
                          {cliente.localidad}, {cliente.provincia}, {cliente.pais}
                        </p>

                        <p className={`mt-2 text-xs ${mutedText}`}>
                          Lat: {cliente.latitud} · Lng: {cliente.longitud}
                        </p>

                        <a
                          href={`https://www.openstreetmap.org/?mlat=${cliente.latitud}&mlon=${cliente.longitud}#map=15/${cliente.latitud}/${cliente.longitud}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block rounded-xl bg-violet-700 px-4 py-2 text-sm font-bold text-white"
                        >
                          Ver georreferencia
                        </a>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {activeSection === 'usuarios' && (
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Usuarios y Roles</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Lectura operativa de usuarios reales registrados en la base.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-225 text-left text-sm">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <th className="py-3">Usuario</th>
                          <th>Email</th>
                          <th>Rol</th>
                          <th>Cliente</th>
                          <th>Localidad</th>
                          <th>Estado</th>
                        </tr>
                      </thead>

                      <tbody>
                        {usuarios.slice(0, 80).map((usuario) => (
                          <tr key={usuario._id} className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <td className="py-4 font-semibold">
                              {[usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                            </td>
                            <td>{usuario.email}</td>
                            <td className="capitalize">{usuario.rol}</td>
                            <td>{usuario.clienteNombre || 'UrbanFlow'}</td>
                            <td>{usuario.localidad || '-'}</td>
                            <td>
                              <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
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
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Centro Operativo de Incidentes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Incidentes reales con prioridad, estado, categoría y georreferencia operativa.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-275 text-left text-sm">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                          <th className="py-3">Título</th>
                          <th>Cliente</th>
                          <th>Estado</th>
                          <th>Prioridad</th>
                          <th>Categoría</th>
                          <th>Localidad</th>
                          <th>Fecha</th>
                          <th>Mapa</th>
                        </tr>
                      </thead>

                      <tbody>
                        {reportes.slice(0, 100).map((reporte) => (
                          <tr key={reporte._id} className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <td className="py-4 font-semibold">{reporte.titulo}</td>
                            <td>{reporte.clienteNombre || '-'}</td>
                            <td className="capitalize">{reporte.estado}</td>
                            <td className="capitalize">{reporte.prioridad}</td>
                            <td className="capitalize">{reporte.categoria_asignada_por_ia || 'sin categoría'}</td>
                            <td>{reporte.localidad || '-'}</td>
                            <td>{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
                            <td>
                              {reporte.latitud && reporte.longitud ? (
                                <a
                                  href={`https://www.openstreetmap.org/?mlat=${reporte.latitud}&mlon=${reporte.longitud}#map=16/${reporte.latitud}/${reporte.longitud}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-xl bg-violet-700 px-3 py-2 text-xs font-bold text-white"
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
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Informes Ejecutivos</h3>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <p className="font-black">Situación actual</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Hay {dashboard.resumen.totalReportes} incidentes registrados, con{' '}
                        {criticalCount + highCount} casos de prioridad alta o crítica.
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <p className="font-black">Foco operativo</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        La categoría más frecuente es {mostFrequentCategory?._id || 'sin datos'},
                        con {mostFrequentCategory?.total || 0} reportes.
                      </p>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <p className="font-black">Recomendación</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Priorizar incidentes críticos, pendientes y zonas con acumulación de reportes.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'analitica' && (
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Analítica Inteligente</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Lectura comparativa para detectar saturación operativa.
                  </p>

                  <div className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <h4 className="font-black">Estados</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize">{item._id}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <h4 className="font-black">Prioridades</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize">{item._id}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-5 ${softCardBg}`}>
                      <h4 className="font-black">Categorías</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 8).map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize">{item._id || 'sin categoría'}</span>
                            <strong>{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'configuracion' && (
                <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                  <h3 className="text-2xl font-black">Configuración del Sistema</h3>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl bg-emerald-600 p-5 text-white">
                      <p className="text-sm font-bold">Backend</p>
                      <h4 className="mt-2 text-2xl font-black">Conectado</h4>
                    </div>

                    <div className="rounded-2xl bg-emerald-600 p-5 text-white">
                      <p className="text-sm font-bold">MongoDB Atlas</p>
                      <h4 className="mt-2 text-2xl font-black">Operativo</h4>
                    </div>

                    <div className="rounded-2xl bg-violet-700 p-5 text-white">
                      <p className="text-sm font-bold">IA</p>
                      <h4 className="mt-2 text-2xl font-black">Próximo paso</h4>
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