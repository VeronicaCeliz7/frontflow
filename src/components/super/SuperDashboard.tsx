import { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useTheme } from '../context/ThemeContext';
import SuperSidebar from './SuperSidebar';

const stats = [
  { title: 'Clientes', value: '32', subtitle: 'Municipios activos', icon: '🏛️' },
  { title: 'Usuarios', value: '248', subtitle: 'Usuarios totales', icon: '👥' },
  { title: 'Incidentes', value: '1.842', subtitle: 'Totales de informes', icon: '📍' },
  { title: 'Resueltos', value: '1.256', subtitle: '68% del total', icon: '✅' },
  { title: 'Pendientes', value: '586', subtitle: '32% del total', icon: '⚠️' },
];

export default function SuperDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  const pageBg = isDark ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-950';
  const headerBg = isDark
    ? 'border-slate-800 bg-slate-950/90'
    : 'border-slate-200 bg-white/90';

  const cardBg = isDark
    ? 'border-slate-800 bg-slate-900 text-white'
    : 'border-slate-200 bg-white text-slate-950';

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

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
                Control total de la plataforma UrbanFlow
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
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

          <section className="grid gap-6 xl:grid-cols-2">
            <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
              <h3 className="text-lg font-black">Incidentes por mes</h3>

              <div className="mt-6 flex h-52 items-end gap-3">
                {[35, 48, 42, 60, 75, 58, 82, 95, 78, 88, 105, 120].map((h, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-violet-700 to-violet-300"
                      style={{ height: `${h}%` }}
                    />
                    <span className={`text-[10px] ${mutedText}`}>
                      {['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
              <h3 className="text-lg font-black">Incidentes por estado</h3>

              <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                <div className="h-44 w-44 rounded-full bg-[conic-gradient(#16a34a_0_55%,#f59e0b_55%_78%,#ef4444_78%_100%)] p-6">
                  <div className={`grid h-full w-full place-items-center rounded-full text-center ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                    <div>
                      <p className="text-2xl font-black">1.842</p>
                      <p className={`text-xs ${mutedText}`}>Total</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-600" /> Resueltos 55%</p>
                  <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-500" /> En proceso 23%</p>
                  <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500" /> Pendientes 22%</p>
                </div>
              </div>
            </div>
          </section>

          <section className={`rounded-2xl border p-5 shadow-sm ${cardBg}`}>
            <h3 className="text-lg font-black">Incidentes recientes</h3>
            <p className={`mt-1 text-sm ${mutedText}`}>
              Vista global de todos los clientes.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                    <th className="py-3">ID</th>
                    <th>Título</th>
                    <th>Cliente</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['#1842', 'Bache en avenida principal', 'Municipio Centro', 'En proceso', 'Alta'],
                    ['#1841', 'Luminaria apagada', 'Municipio Norte', 'Pendiente', 'Media'],
                    ['#1840', 'Basural urbano', 'Municipio Sur', 'Resuelto', 'Alta'],
                  ].map((row) => (
                    <tr key={row[0]} className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                      {row.map((cell) => (
                        <td key={cell} className="py-4">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}