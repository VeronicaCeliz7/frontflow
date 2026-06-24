import UrbanFlowLogo from '../UrbanFlowLogo';
import { LayoutDashboard, Building2, Users, MapPin, FileText, TrendingUp, Settings, LogOut, Menu } from 'lucide-react';
import { useClerk } from '@clerk/clerk-react';

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

const items: { id: SuperSection; label: string; icon: React.ReactNode }[] = [
  { id: 'panel', label: 'Panel', icon: <LayoutDashboard size={18} /> },
  { id: 'clientes', label: 'Clientes', icon: <Building2 size={18} /> },
  { id: 'usuarios', label: 'Usuarios', icon: <Users size={18} /> },
  { id: 'incidentes', label: 'Incidentes', icon: <MapPin size={18} /> },
  { id: 'informes', label: 'Informes', icon: <FileText size={18} /> },
  { id: 'analitica', label: 'Analítica', icon: <TrendingUp size={18} /> },
  { id: 'configuracion', label: 'Configuración', icon: <Settings size={18} /> },
];

export default function SuperSidebar({
  mobileOpen,
  collapsed,
  activeSection,
  onSectionChange,
  onToggleCollapse,
  onClose,
}: Props) {
  const { signOut } = useClerk();

  const handleSectionClick = (section: SuperSection) => {
    onSectionChange(section);
    onClose();
  };

  const activeClass = 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  const inactiveClass = 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800';

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
        } ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex h-full flex-col">
          {/* Header con logo */}
          <div className={`p-4 border-b border-gray-200 dark:border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <UrbanFlowLogo size="small" showText={false} />
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">UrbanFlow</span>
              </div>
            )}
            {collapsed && (
              <div className="flex items-center justify-center w-full">
                <UrbanFlowLogo size="small" showText={false} />
              </div>
            )}
            {/* Botón de tres líneas - SOLO EN MÓVIL */}
            <button
              onClick={onToggleCollapse}
              className="lg:hidden text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1"
              aria-label="Abrir menú"
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Badge de rol */}
          <div className={`mx-3 mt-3 p-2 rounded-md bg-gray-100 dark:bg-gray-800 ${collapsed ? 'text-center' : ''}`}>
            <p className={`text-xs font-medium text-gray-600 dark:text-gray-400 ${collapsed ? 'text-center' : ''}`}>
              {collapsed ? 'SA' : 'Superadministrador'}
            </p>
          </div>

          {/* Navegación */}
          <nav className={`flex-1 p-3 space-y-1 mt-2 ${collapsed ? 'px-2' : ''}`}>
            {items.map((item) => {
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  title={item.label}
                  onClick={() => handleSectionClick(item.id)}
                  className={`flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    collapsed ? 'justify-center' : ''
                  } ${
                    isActive ? activeClass : inactiveClass
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Botón cerrar sesión */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => signOut({ redirectUrl: '/' })}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <LogOut size={16} />
              {!collapsed && 'Cerrar sesión'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}