import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // 👈 IMPORTANTE
import { UserButton } from '@clerk/clerk-react';
import SuperSidebar from './SuperSidebar';
import SuperMap from './SuperMap';
import { Crown, Building2, HardHat, User } from 'lucide-react';  // 👈 Íconos profesionales

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
  const navigate = useNavigate();  // 👈 Hook de navegación
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

  // Estilos fijos shadcn (modo claro, minimalista)
  const pageBg = 'bg-gray-50';
  const cardBg = 'bg-white border border-gray-200 rounded-lg p-4 shadow-none';
  const softCardBg = 'bg-white border border-gray-200 rounded-lg p-4 shadow-none';
  const mutedText = 'text-gray-500';

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
        {/* Header minimalista */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-gray-300 px-3 py-2 font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-gray-900 sm:text-2xl">
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

        {/* Menú de navegación entre roles (CORREGIDO con navigate e íconos lucide-react) */}
<div className="px-4 sm:px-6">
  <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
    <button
      onClick={() => navigate('/superadmin')}
      className={`rounded-md px-4 py-2 text-sm font-medium transition flex items-center gap-2 ${
        window.location.pathname.startsWith('/superadmin')
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Crown size={16} />
      Superadmin
    </button>
    <button
      onClick={() => navigate('/municipality/admin')}
      className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center gap-2"
    >
      <Building2 size={16} />
      Admin
    </button>
    <button
      onClick={() => navigate('/municipality/operator')}
      className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center gap-2"
    >
      <HardHat size={16} />
      Operador
    </button>
    <button
      onClick={() => window.location.href = '/'}
      className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center gap-2"
    >
      <User size={16} />
      Ciudadano
    </button>
  </div>
</div>




        <div className="space-y-6 p-4 sm:p-6">
          {loading && (
            <section className={cardBg}>
              <p className="font-medium text-gray-700">Cargando datos reales del backend...</p>
            </section>
          )}

          {error && (
            <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              <p className="font-medium">{error}</p>
            </section>
          )}

          {!loading && !error && dashboard && (
            <>
              {activeSection === 'panel' && (
                <>
                  {/* Tarjetas de resumen */}
                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => setActiveSection(item.section)}
                        className="rounded-lg border border-gray-200 bg-white p-4 text-left shadow-none transition hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-blue-600">
                              {item.title}
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-gray-900">{item.value}</h3>
                            <p className={`mt-1 text-xs ${mutedText}`}>{item.subtitle}</p>
                          </div>
                          <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-600 text-2xl text-white">
                            {item.icon}
                          </div>
                        </div>
                      </button>
                    ))}
                  </section>

                  {/* Tarjetas de prioridad / resolución (versión suave, minimalista) */}
                  <section className="grid gap-4 lg:grid-cols-4">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-none">
                      <p className="text-sm font-bold text-red-800">Críticos</p>
                      <h3 className="mt-2 text-3xl font-black text-red-900">{criticalCount}</h3>
                      <p className="mt-1 text-xs text-red-700">Atención inmediata</p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-none">
                      <p className="text-sm font-bold text-orange-800">Alta prioridad</p>
                      <h3 className="mt-2 text-3xl font-black text-orange-900">{highCount}</h3>
                      <p className="mt-1 text-xs text-orange-700">Requieren seguimiento</p>
                    </div>

                    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-none">
                      <p className="text-sm font-bold text-yellow-800">Pendientes</p>
                      <h3 className="mt-2 text-3xl font-black text-yellow-900">{pendingCount}</h3>
                      <p className="mt-1 text-xs text-yellow-700">Backlog operativo</p>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 shadow-none">
                      <p className="text-sm font-bold text-green-800">Resolución</p>
                      <h3 className="mt-2 text-3xl font-black text-green-900">{resolutionRate}%</h3>
                      <p className="mt-1 text-xs text-green-700">Reportes resueltos</p>
                    </div>
                  </section>

                  {/* Detalle de estados, prioridades y categorías */}
                  <section className="grid gap-6 xl:grid-cols-3">
                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900">Reportes por estado</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900">Reportes por prioridad</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={cardBg}>
                      <h3 className="text-lg font-bold text-gray-900">Categorías IA</h3>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 6).map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{item._id || 'sin categoría'}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeSection === 'clientes' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Organizaciones reales conectadas a UrbanFlow, con localización y acceso directo al mapa.
                  </p>

                  <div className="mt-6">
                    <SuperMap clientes={clientes} />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {clientes.map((cliente) => (
                      <article key={cliente._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-bold text-gray-900">{cliente.nombre}</h4>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
                            Activo
                          </span>
                        </div>

                        <p className={`mt-2 text-sm capitalize ${mutedText}`}>
                          {cliente.tipo.replace('_', ' ')}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-gray-700">
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
    <h3 className="text-2xl font-bold text-gray-900">Usuarios y Roles</h3>
    <p className={`mt-2 ${mutedText}`}>
      Lectura operativa de usuarios reales registrados en la base.
    </p>

    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[225px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
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
            <tr key={usuario._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-4 font-semibold text-gray-900">
                {[usuario.nombre, usuario.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
              </td>
              <td className="text-gray-700">{usuario.email}</td>
              <td className="capitalize text-gray-700">{usuario.rol}</td>
              <td className="text-gray-700">{usuario.clienteNombre || 'UrbanFlow'}</td>
              <td className="text-gray-700">{usuario.localidad || '-'}</td>
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
                  <h3 className="text-2xl font-bold text-gray-900">Centro Operativo de Incidentes</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Incidentes reales con prioridad, estado, categoría y georreferencia operativa.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[275px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
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
                          <tr key={reporte._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 font-semibold text-gray-900">{reporte.titulo}</td>
                            <td className="text-gray-700">{reporte.clienteNombre || '-'}</td>
                            <td className="capitalize text-gray-700">{reporte.estado}</td>
                            <td className="capitalize text-gray-700">{reporte.prioridad}</td>
                            <td className="capitalize text-gray-700">{reporte.categoria_asignada_por_ia || 'sin categoría'}</td>
                            <td className="text-gray-700">{reporte.localidad || '-'}</td>
                            <td className="text-gray-700">{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
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
                  <h3 className="text-2xl font-bold text-gray-900">Informes Ejecutivos</h3>

                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <p className="font-bold text-gray-900">Situación actual</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Hay {dashboard.resumen.totalReportes} incidentes registrados, con{' '}
                        {criticalCount + highCount} casos de prioridad alta o crítica.
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <p className="font-bold text-gray-900">Foco operativo</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        La categoría más frecuente es {mostFrequentCategory?._id || 'sin datos'},
                        con {mostFrequentCategory?.total || 0} reportes.
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <p className="font-bold text-gray-900">Recomendación</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>
                        Priorizar incidentes críticos, pendientes y zonas con acumulación de reportes.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'analitica' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900">Analítica Inteligente</h3>
                  <p className={`mt-2 ${mutedText}`}>
                    Lectura comparativa para detectar saturación operativa.
                  </p>

                  <div className="mt-6 grid gap-6 xl:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <h4 className="font-bold text-gray-900">Estados</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <h4 className="font-bold text-gray-900">Prioridades</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-none">
                      <h4 className="font-bold text-gray-900">Categorías</h4>
                      <div className="mt-4 space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 8).map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700">{item._id || 'sin categoría'}</span>
                            <strong className="text-gray-900">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {activeSection === 'configuracion' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h3>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700">Backend</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900">Conectado</h4>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700">MongoDB Atlas</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900">Operativo</h4>
                    </div>

                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-none">
                      <p className="text-sm font-medium text-gray-700">IA</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900">Próximo paso</h4>
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