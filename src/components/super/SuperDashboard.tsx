import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import SuperSidebar from './SuperSidebar';
import { getSuperDashboard } from '../../Services/superApi';

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
  ultimosReportes: {
    _id: string;
    titulo: string;
    clienteNombre: string;
    estado: string;
    prioridad: string;
    categoria_asignada_por_ia: string;
    localidad: string;
    provincia: string;
    pais: string;
    fecha_hora: string;
  }[];
};

export default function SuperDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getSuperDashboard();
        setDashboard(data);
      } catch {
        setError('No se pudo conectar con el backend.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const pageBg = isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-950';
  const headerBg = isDark ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-white/90';
  const cardBg = isDark ? 'border-slate-800 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-950';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const stats = [
    {
      title: 'Clientes',
      value: dashboard?.resumen.totalClientes ?? 0,
      subtitle: 'Organizaciones activas',
      icon: '🏛️',
    },
    {
      title: 'Usuarios',
      value: dashboard?.resumen.totalUsuarios ?? 0,
      subtitle: 'Usuarios totales',
      icon: '👥',
    },
    {
      title: 'Ciudadanos',
      value: dashboard?.resumen.totalCiudadanos ?? 0,
      subtitle: 'Usuarios ciudadanos',
      icon: '🧑‍🤝‍🧑',
    },
    {
      title: 'Incidentes',
      value: dashboard?.resumen.totalReportes ?? 0,
      subtitle: 'Reportes registrados',
      icon: '📍',
    },
  ];

  return (
    <div className={`min-h-screen ${pageBg} lg:flex`}>
      <SuperSidebar
        mobileOpen={mobileOpen}
        collapsed={sidebarCollapsed}
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
                Bienvenido, Súper Usuario
              </h2>
              <p className={`text-xs sm:text-sm ${mutedText}`}>
                Dashboard conectado al backend real de UrbanFlow
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
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
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
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <article
                    key={item.title}
                    className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${cardBg}`}
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
                  </article>
                ))}
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

              <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
                <h3 className="text-lg font-black">Incidentes recientes</h3>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Datos reales provenientes de MongoDB Atlas.
                </p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-180 text-left text-sm">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                        <th className="py-3">Título</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Prioridad</th>
                        <th>Categoría</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.ultimosReportes.map((reporte) => (
                        <tr
                          key={reporte._id}
                          className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}
                        >
                          <td className="py-4 font-semibold">{reporte.titulo}</td>
                          <td>{reporte.clienteNombre}</td>
                          <td className="capitalize">{reporte.estado}</td>
                          <td className="capitalize">{reporte.prioridad}</td>
                          <td className="capitalize">{reporte.categoria_asignada_por_ia}</td>
                          <td>{new Date(reporte.fecha_hora).toLocaleString('es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}