import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FileText, Users, Settings, LogOut, ClipboardList, X, Building2 } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  role: 'admin' | 'operator'
}

export default function Sidebar({ isOpen, onClose, role }: Props) {
  const isAdmin = role === 'admin'

  const adminLinks = [
    { to: '/municipality/admin',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/municipality/admin/reportes', icon: FileText,        label: 'Reportes' },
    { to: '/municipality/admin/usuarios', icon: Users,           label: 'Usuarios' },
    { to: '/municipality/admin/config',   icon: Settings,        label: 'Configuración' },
  ]

  const operatorLinks = [
    { to: '/municipality/operator',           icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/municipality/operator/asignados', icon: ClipboardList,   label: 'Mis incidentes' },
    { to: '/municipality/operator/reportes',  icon: FileText,        label: 'Reportes' },
  ]

  const links = isAdmin ? adminLinks : operatorLinks
  const activeClass = isAdmin ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
  const inactiveClass = isAdmin ? 'text-gray-500 hover:bg-blue-50 hover:text-blue-700' : 'text-gray-500 hover:bg-green-50 hover:text-green-700'

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-30 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isAdmin ? 'bg-blue-600' : 'bg-green-600'}`}>
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-sm">UrbanFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className={`mx-3 mt-3 p-3 rounded-xl ${isAdmin ? 'bg-blue-50' : 'bg-green-50'}`}>
          <p className={`text-xs font-semibold ${isAdmin ? 'text-blue-600' : 'text-green-600'}`}>
            {isAdmin ? 'Admin del Municipio' : 'Empleado Municipal'}
          </p>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? activeClass : inactiveClass}`}
            >
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={18} />Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}