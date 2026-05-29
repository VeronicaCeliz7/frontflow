
import UsuariosPage from './UsuariosPage.tsx'
import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { FileText, Users, AlertTriangle, CheckCircle, Menu, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'

import Sidebar from '../components/Sidebar.tsx'
import StatCard from '../components/StatCard.tsx'
import IncidentTable from '../components/IncidentTable.tsx'
import IncidentDetailModal from '../components/IncidentDetailModal'
const queryClient = new QueryClient()

const barData = [
  { categoria: 'Baches',     cantidad: 45 },
  { categoria: 'Luminarias', cantidad: 28 },
  { categoria: 'Residuos',   cantidad: 37 },
  { categoria: 'Veredas',    cantidad: 19 },
  { categoria: 'Otros',      cantidad: 12 },
]

const pieData = [
  { name: 'Resueltos',   value: 309 },
  { name: 'En progreso', value: 123 },
  { name: 'Pendientes',  value: 432 },
]

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

const MOCK_STATS = { open: 24, total: 432, in_progress: 123, resolved: 309 }

const mockIncidents = [
  { _id: '001abc', titulo: 'Bache en Av. Corrientes', prioridad: 'alta',    estado: 'open',        createdAt: new Date() },
  { _id: '002abc', titulo: 'Luminaria rota en Plaza', prioridad: 'media',   estado: 'in_progress', createdAt: new Date() },
  { _id: '003abc', titulo: 'Residuos en vereda',      prioridad: 'baja',    estado: 'resolved',    createdAt: new Date() },
  { _id: '004abc', titulo: 'Semáforo sin funcionar',  prioridad: 'crítica', estado: 'open',        createdAt: new Date() },
]

function AdminHome() {
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const [selectedIncident, setSelectedIncident] = useState<any>(null)

  const filtered = mockIncidents.filter((i) => {
    if (statusFilter && i.estado !== statusFilter) return false
    if (priorityFilter && i.prioridad !== priorityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Bienvenido, Administrador 👋
        </h1>

        <p className="text-gray-400 text-sm mt-1">
          Panel de administración del municipio
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Activos"
          value={MOCK_STATS.open}
          icon={AlertTriangle}
          color="red"
          subtitle="Incidentes abiertos"
        />

        <StatCard
          title="Total"
          value={MOCK_STATS.total}
          icon={FileText}
          color="blue"
          subtitle="Todos los reportes"
        />

        <StatCard
          title="En progreso"
          value={MOCK_STATS.in_progress}
          icon={TrendingUp}
          color="yellow"
          subtitle="28% del mes"
        />

        <StatCard
          title="Resueltos"
          value={MOCK_STATS.resolved}
          icon={CheckCircle}
          color="green"
          subtitle="71% del mes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">
            Incidentes por categoría
          </h2>

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
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              />

              <Bar
                dataKey="cantidad"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">
            Incidentes por estado
          </h2>

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
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i]}
                  />
                ))}
              </Pie>

              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => (
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: 12
                    }}
                  >
                    {v}
                  </span>
                )}
              />

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

          <h2 className="font-semibold text-gray-700">
            Incidentes recientes
          </h2>

          <div className="flex gap-2 flex-wrap">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white"
            >
              <option value="">
                Todos los estados
              </option>

              <option value="open">
                Abierto
              </option>

              <option value="in_progress">
                En progreso
              </option>

              <option value="resolved">
                Resuelto
              </option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value)
              }
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white"
            >
              <option value="">
                Todas las prioridades
              </option>

              <option value="baja">
                Baja
              </option>

              <option value="media">
                Media
              </option>

              <option value="alta">
                Alta
              </option>

              <option value="crítica">
                Crítica
              </option>
            </select>

          </div>
        </div>

        <IncidentTable
          incidents={filtered}
          isLoading={false}
          onView={(incident) =>
            setSelectedIncident(incident)
          }
        />

        <IncidentDetailModal
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() =>
            setSelectedIncident(null)
          }
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
  const role = user?.publicMetadata?.role

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="admin" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <Menu size={22} />
          </button>

          {/* Menú de navegación (visible para admin y superadmin) */}
          {(role === 'admin' || role === 'superadmin') && (
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => navigate('/municipality/admin')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  location.pathname === '/municipality/admin' || location.pathname === '/municipality/admin/'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🏛️ Administrador
              </button>
              <button
                onClick={() => navigate('/municipality/operator')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                👷 Operador
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                🧑 Ciudadano
              </button>
            </div>
          )}

          {/* Botón Volver a Superadmin (solo si es superadmin) */}
          {role === 'superadmin' && (
            <button
              onClick={() => navigate('/superadmin')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition ml-auto"
            >
              👑 Superadministrador
            </button>
          )}

          {/* Etiqueta de rol (solo si NO es superadmin) */}
          {role !== 'superadmin' && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                Administrador
              </span>
            </div>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="reportes" element={<AdminHome />} />
            <Route path="usuarios" element={<UsuariosPage />} />
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
