import UsuariosPage from './UsuariosPage'
import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Menu,
  TrendingUp,
  Building2,
  HardHat,
  User,
  Crown
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'

import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import IncidentTable from '../components/IncidentTable'
import IncidentDetailModal from '../components/IncidentDetailModal'
import { useIncidents } from '../hooks/useIncidents'

import OperadoresPage from './OperadoresPage'
import OperatorDetailPage from './OperatorDetailPage'
import ClimaPredictivoCard from '../../../components/ClimaPredictivoCard'
import IAHeatmap from '../../../components/IAHeatmap'

const queryClient = new QueryClient()

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

function AdminHome() {
  const { user } = useUser()

  const nombreAdmin = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const municipio = (user?.publicMetadata?.municipio as string) || 'villa-maria'

  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const { data, isLoading } = useIncidents({ municipio })

  const incidents = data?.data || []

  const filtered = incidents.filter((i: any) => {
    if (statusFilter && i.estado !== statusFilter) return false
    if (priorityFilter && i.prioridad !== priorityFilter) return false
    return true
  })

  const total = incidents.length
  const pendientes = incidents.filter((i: any) => i.estado === 'pendiente').length
  const enProceso = incidents.filter((i: any) => i.estado === 'en_proceso').length
  const resueltos = incidents.filter((i: any) => i.estado === 'resuelto').length
  const rechazados = incidents.filter((i: any) => i.estado === 'rechazado').length
  const criticos = incidents.filter((i: any) => i.prioridad === 'critica').length

  const categorias = incidents.reduce((acc: any, item: any) => {
    const categoria = item.categoria_asignada_por_ia || 'Sin categoría'
    acc[categoria] = (acc[categoria] || 0) + 1
    return acc
  }, {})

  const barData = Object.keys(categorias).map((categoria) => ({
    categoria,
    cantidad: categorias[categoria]
  }))

  const pieData = [
    { name: 'Pendientes', value: pendientes },
    { name: 'En proceso', value: enProceso },
    { name: 'Resueltos', value: resueltos },
    { name: 'Rechazados', value: rechazados }
  ].filter((item) => item.value > 0)


  
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Bienvenido, {nombreAdmin || 'Administrador'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Administrás: Municipalidad de Villa María
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pendientes"
          value={pendientes}
          icon={AlertTriangle}
          color="red"
          subtitle="Sin resolver"
        />
        <StatCard
          title="Total"
          value={total}
          icon={FileText}
          color="blue"
          subtitle="Reportes del municipio"
        />
        <StatCard
          title="En proceso"
          value={enProceso}
          icon={TrendingUp}
          color="yellow"
          subtitle="Gestionándose"
        />
        <StatCard
          title="Resueltos"
          value={resueltos}
          icon={CheckCircle}
          color="green"
          subtitle="Finalizados"
        />
      </div>

      {criticos > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          Hay {criticos} incidente(s) crítico(s) en el municipio.
        </div>
      )}

<div className="mt-5">
  <ClimaPredictivoCard />
</div>

<div className="mt-5">
  <IAHeatmap />
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">
            Incidentes por categoría
          </h2>

          {barData.length === 0 ? (
            <p className="text-sm text-gray-400">No hay datos para mostrar.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={32}>
                <XAxis
                  dataKey="categoria"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: 'none'
                  }}
                />
                <Bar dataKey="cantidad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-900 text-sm mb-3">
            Incidentes por estado
          </h2>

          {pieData.length === 0 ? (
            <p className="text-sm text-gray-400">No hay datos para mostrar.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => (
                    <span style={{ color: '#6b7280', fontSize: 12 }}>{v}</span>
                  )}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold text-gray-900 text-sm">
            Incidentes recientes
          </h2>

          <div className="flex gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800"
            >
              <option value="">Todos los estados</option>
              <option value="reportado">Reportado</option>
              <option value="validacion_inicial">Validación inicial</option>
              <option value="aceptado">Aceptado</option>
              <option value="asignado">Asignado</option>
              <option value="en_proceso">En proceso</option>
              <option value="resuelto">Resuelto</option>
              <option value="verificado">Verificado</option>
              <option value="cerrado">Cerrado</option>
              <option value="rechazado">Rechazado</option>
              <option value="duplicado">Duplicado</option>
              <option value="informacion_insuficiente">Información insuficiente</option>
              <option value="fuera_de_jurisdiccion">Fuera de jurisdicción</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800"
            >
              <option value="">Todas las prioridades</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>
        </div>

        <IncidentTable
          incidents={filtered}
          isLoading={isLoading}
          onView={(incident) => setSelectedIncident(incident)}
        />

        <IncidentDetailModal
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      </div>
    </div>
  )
}

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUser()

  const role = user?.publicMetadata?.role as string | undefined
  const roles = (user?.publicMetadata?.roles as string[]) || []

  const isSuperAdmin = role === 'superadmin' || roles.includes('superadmin')
  const isAdmin = role === 'admin' || roles.includes('admin')
  const isOperator =
    role === 'operator' ||
    role === 'operador' ||
    roles.includes('operator') ||
    roles.includes('operador')

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={20} />
          </button>

          <div className="flex gap-2 ml-4">
            {(isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/admin')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                  location.pathname === '/municipality/admin' ||
                  location.pathname === '/municipality/admin/'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Building2 size={14} />
                Administrador
              </button>
            )}

            {(isOperator || isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/operator')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <HardHat size={14} />
                Operador
              </button>
            )}

            {(isAdmin || isOperator || isSuperAdmin) && (
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <User size={14} />
                Ciudadano
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => navigate('/superadmin')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition flex items-center gap-1.5"
              >
                <Crown size={14} />
                Superadministrador
              </button>
            )}
          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                Administrador
              </span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="reportes" element={<AdminHome />} />
            <Route path="usuarios" element={<UsuariosPage />} />
            <Route path="operadores" element={<OperadoresPage />} />
            <Route path="operadores/:id" element={<OperatorDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout />
    </QueryClientProvider>
  )
}