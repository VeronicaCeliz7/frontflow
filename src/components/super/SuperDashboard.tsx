import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import SuperSidebar from './SuperSidebar';
import SuperMap from './SuperMap';
import { 
  Crown, Building2, HardHat, User, 
  AlertTriangle, FileText, TrendingUp, CheckCircle 
} from 'lucide-react';
import StatCard from '../../features/municipality/components/StatCard'; // Ruta CORRECTA al StatCard original

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
  vectorizado?: boolean;
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

            <div className="min-w-0 flex-1">
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

          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
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
                        <div className="space-y-3">
                          {dashboard.graficos.reportesPorCategoria.slice(0, 8).map((item) => (
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
                      )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h2 className="font-semibold text-gray-900 text-sm mb-3">
                        Incidentes por estado
                      </h2>
                      <div className="space-y-3">
                        {dashboard.graficos.reportesPorEstado.map((item) => (
                          <div key={item._id} className="flex items-center justify-between">
                            <span className="capitalize text-gray-700">{item._id}</span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${(item.total / dashboard.resumen.totalReportes) * 100}%`,
                                    backgroundColor: 
                                      item._id === 'pendiente' ? '#ef4444' :
                                      item._id === 'en_proceso' ? '#f59e0b' :
                                      item._id === 'resuelto' ? '#22c55e' : '#6b7280'
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

                  {/* Incidentes recientes */}
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                    <h2 className="font-semibold text-gray-900 text-sm mb-3">
                      Incidentes recientes
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-800">
                            <th className="py-3 text-gray-700 dark:text-gray-300">Título</th>
                            <th className="py-3 text-gray-700 dark:text-gray-300">Cliente</th>
                            <th className="py-3 text-gray-700 dark:text-gray-300">Estado</th>
                            <th className="py-3 text-gray-700 dark:text-gray-300">Prioridad</th>
                            <th className="py-3 text-gray-700 dark:text-gray-300">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportes.slice(0, 10).map((reporte) => (
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
                              <td className="text-gray-700 dark:text-gray-300">{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
                  <div className="mt-6">
                    <SuperMap clientes={clientes} />
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
                        <a href={`https://www.openstreetmap.org/?mlat=${cliente.latitud}&mlon=${cliente.longitud}#map=15/${cliente.latitud}/${cliente.longitud}`} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Ver georreferencia</a>
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
                    <table className="w-full min-w-[225px] text-left text-sm">
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
                    <table className="w-full min-w-[275px] text-left text-sm">
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Informes Ejecutivos</h3>
                  <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Situación actual</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>Hay {dashboard.resumen.totalReportes} incidentes registrados, con {criticalCount} críticos y {highCount} de alta prioridad.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Foco operativo</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>La categoría más frecuente es {mostFrequentCategory?._id || 'sin datos'}, con {mostFrequentCategory?.total || 0} reportes.</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 shadow-none">
                      <p className="font-bold text-gray-900 dark:text-gray-100">Clientes activos</p>
                      <p className={`mt-2 text-sm ${mutedText}`}>Hay {dashboard.resumen.totalClientes} clientes activos en la plataforma.</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Analitica section */}
              {activeSection === 'analitica' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analítica Inteligente</h3>
                  <p className={`mt-2 ${mutedText}`}>Distribución de incidentes por categoría y prioridad.</p>
                  <div className="mt-6 grid gap-6 xl:grid-cols-2">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Por categoría</h4>
                      <div className="space-y-3">
                        {dashboard.graficos.reportesPorCategoria.slice(0, 8).map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id || 'sin categoría'}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Por prioridad</h4>
                      <div className="space-y-3">
                        {dashboard.graficos.reportesPorPrioridad.map((item) => (
                          <div key={item._id} className="flex justify-between">
                            <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                            <strong className="text-gray-900 dark:text-gray-100">{item.total}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Configuracion section */}
              {activeSection === 'configuracion' && (
                <section className={cardBg}>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración del Sistema</h3>
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Conectado</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">MongoDB Atlas</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Operativo</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">IA</p>
                      <h4 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">Activa</h4>
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