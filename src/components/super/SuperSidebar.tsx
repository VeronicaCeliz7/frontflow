type SuperSection =
  | 'panel'
  | 'clientes'
  | 'usuarios'
  | 'incidentes'
  | 'informes'
  | 'analitica'
  | 'configuracion';

type Props = {
  mobileOpen: boolean;
  collapsed: boolean;
  activeSection: SuperSection;
  onSectionChange: (section: SuperSection) => void;
  onToggleCollapse: () => void;
  onClose: () => void;
};

const items: { id: SuperSection; label: string; icon: string; description: string }[] = [
  {
    id: 'panel',
    label: 'Panel',
    icon: '📊',
    description: 'KPIs globales',
  },
  {
    id: 'clientes',
    label: 'Clientes',
    icon: '🏛️',
    description: 'Organizaciones activas',
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    icon: '👥',
    description: 'Roles y actividad',
  },
  {
    id: 'incidentes',
    label: 'Incidentes',
    icon: '📍',
    description: 'Gestión operativa',
  },
  {
    id: 'informes',
    label: 'Informes',
    icon: '📄',
    description: 'Resumen ejecutivo',
  },
  {
    id: 'analitica',
    label: 'Analítica',
    icon: '📈',
    description: 'Tendencias y prioridades',
  },
  {
    id: 'configuracion',
    label: 'Configuración',
    icon: '⚙️',
    description: 'Estado del sistema',
  },
];

export default function SuperSidebar({
  mobileOpen,
  collapsed,
  activeSection,
  onSectionChange,
  onToggleCollapse,
  onClose,
}: Props) {
  const handleSectionClick = (section: SuperSection) => {
    onSectionChange(section);
    onClose();
  };

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
            {items.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => handleSectionClick(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-950/30'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>

                  {!collapsed && (
                    <span className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {item.description}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="mt-auto rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-bold">Centro de decisión</p>
              <p className="mt-1 text-xs text-slate-400">
                Datos reales para priorizar, actuar y medir impacto urbano.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}