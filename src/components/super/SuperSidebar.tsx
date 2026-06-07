import UrbanFlowLogo from '../UrbanFlowLogo';
import { LayoutDashboard, Building2, Users, MapPin, FileText, TrendingUp, Settings } from 'lucide-react';

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

const items: { id: SuperSection; label: string; icon: React.ReactNode; description: string }[] = [
  { id: 'panel', label: 'Panel', icon: <LayoutDashboard size={18} />, description: 'KPIs globales' },
  { id: 'clientes', label: 'Clientes', icon: <Building2 size={18} />, description: 'Organizaciones activas' },
  { id: 'usuarios', label: 'Usuarios', icon: <Users size={18} />, description: 'Roles y actividad' },
  { id: 'incidentes', label: 'Incidentes', icon: <MapPin size={18} />, description: 'Gestión operativa' },
  { id: 'informes', label: 'Informes', icon: <FileText size={18} />, description: 'Resumen ejecutivo' },
  { id: 'analitica', label: 'Analítica', icon: <TrendingUp size={18} />, description: 'Tendencias y prioridades' },
  { id: 'configuracion', label: 'Configuración', icon: <Settings size={18} />, description: 'Estado del sistema' },
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
        className={`fixed left-0 top-0 z-40 h-screen transform bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'w-20' : 'w-72'}`}
      >
        <div className="flex h-full flex-col p-4">
          <div className={`mb-8 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                <UrbanFlowLogo size="small" showText={false} />
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">UrbanFlow</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Súper Usuario</p>
                </div>
              </div>
            )}

            <button
              onClick={onToggleCollapse}
              className="grid h-10 w-10 place-items-center rounded-md bg-gray-100 dark:bg-gray-800 text-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
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
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-none'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && (
                    <span className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-[11px] font-normal text-gray-500 dark:text-gray-500">
                        {item.description}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {!collapsed && (
            <div className="mt-auto rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4 shadow-none">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">Centro de decisión</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Datos reales para priorizar, actuar y medir impacto urbano.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}