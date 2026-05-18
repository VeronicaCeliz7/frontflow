type Props = {
  mobileOpen: boolean;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
};

const items = [
  { label: 'Panel', icon: '📊' },
  { label: 'Clientes', icon: '🏛️' },
  { label: 'Usuarios', icon: '👥' },
  { label: 'Incidentes', icon: '📍' },
  { label: 'Informes', icon: '📄' },
  { label: 'Analítica', icon: '📈' },
  { label: 'Configuración', icon: '⚙️' },
];

export default function SuperSidebar({
  mobileOpen,
  collapsed,
  onToggleCollapse,
  onClose,
}: Props) {
  return (
    <>
      {mobileOpen && (
        <button
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          aria-label="Cerrar menú"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen transform bg-slate-950 text-white transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex h-full flex-col p-4">
          <div className={`mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 font-black">
                  UF
                </div>
                <div>
                  <h1 className="text-lg font-black">Flujo Urbano</h1>
                  <p className="text-xs text-slate-400">Súper Usuario</p>
                </div>
              </div>
            )}

            <button
              onClick={onToggleCollapse}
              className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-lg hover:bg-white/20"
              title={collapsed ? 'Abrir menú' : 'Cerrar menú'}
            >
              {collapsed ? '☰' : '‹'}
            </button>
          </div>

          <nav className="space-y-2">
            {items.map((item, index) => (
              <button
                key={item.label}
                title={item.label}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  collapsed ? 'justify-center' : ''
                } ${
                  index === 0
                    ? 'bg-violet-600 text-white'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {!collapsed && (
            <div className="mt-auto rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-bold">Control total</p>
              <p className="mt-1 text-xs text-slate-400">
                Gestión global de municipios, usuarios e incidentes.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}