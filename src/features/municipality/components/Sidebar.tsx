import { NavLink } from 'react-router-dom'
import { useClerk } from '@clerk/clerk-react'
import { LayoutDashboard, FileText, Users, Settings, LogOut, ClipboardList, X, Building2 } from 'lucide-react'
import { UserCog } from 'lucide-react'
import UrbanFlowLogo from "../../../components/UrbanFlowLogo";

interface Props {
  isOpen: boolean
  onClose: () => void
  role: 'admin' | 'operator'
}

export default function Sidebar({ isOpen, onClose, role }: Props) {
  const isAdmin = role === 'admin'
  const { signOut } = useClerk()
  
  const adminLinks = [
    { to: '/municipality/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/municipality/admin/reportes', icon: FileText, label: 'Reportes' },
    { to: '/municipality/admin/usuarios', icon: Users, label: 'Usuarios' },
    { to: '/municipality/admin/operadores', icon: UserCog, label: 'Operadores' },
    { to: '/municipality/admin/config', icon: Settings, label: 'Configuración' },
  ]

  const operatorLinks = [
    { to: '/municipality/operator', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/municipality/operator/asignados', icon: ClipboardList, label: 'Mis incidentes' },
    { to: '/municipality/operator/reportes', icon: FileText, label: 'Reportes' },
  ]

  const links = isAdmin ? adminLinks : operatorLinks
  const activeClass = 'bg-blue-50 text-blue-700 border-blue-200'
  const inactiveClass = 'text-gray-600 hover:bg-gray-100'

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Header con logo */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UrbanFlowLogo size="small" showText={false} />
            <span className="font-bold text-gray-900 text-sm">UrbanFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* Badge de rol */}
        <div className="mx-3 mt-3 p-2 rounded-md bg-gray-100">
          <p className={`text-xs font-medium text-gray-600 text-center`}>
            {isAdmin ? 'Administrador' : 'Empleado Municipal'}
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3 space-y-1 mt-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive ? activeClass : inactiveClass
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Botón cerrar sesión */}
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => signOut({ redirectUrl: '/' })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}