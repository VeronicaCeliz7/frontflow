import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Menu } from 'lucide-react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUser } from '@clerk/clerk-react'

import Sidebar from '../components/Sidebar.tsx'
import StatCard from '../components/StatCard.tsx'
import IncidentTable from '../components/IncidentTable.tsx'

const queryClient = new QueryClient()

const pieData = [
  { name: 'Resueltos',   value: 42 },
  { name: 'En progreso', value: 18 },
  { name: 'Pendientes',  value: 7  },
]

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b']

const MOCK_STATS = { open: 18, in_progress: 7, resolved: 42, critical: 3 }

const mockIncidents = [
  { _id: 'a01abc', titulo: 'Bache en Av. San Martín',  prioridad: 'alta',    estado: 'open',        createdAt: new Date() },
  { _id: 'a02abc', titulo: 'Luminaria rota calle 9',   prioridad: 'media',   estado: 'in_progress', createdAt: new Date() },
  { _id: 'a03abc', titulo: 'Residuos acumulados',      prioridad: 'baja',    estado: 'open',        createdAt: new Date() },
  { _id: 'a04abc', titulo: 'Semáforo sin funcionar',   prioridad: 'crítica', estado: 'in_progress', createdAt: new Date() },
]

function OperatorHome() {
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = statusFilter
    ? mockIncidents.filter(i => i.estado === statusFilter)
    : mockIncidents

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Hola, Juan Pérez 👋</h1>
        <p className="text-gray-400 text-sm mt-1">Empleado Municipal — tus incidentes asignados</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Asignados"   value={MOCK_STATS.open}        icon={ClipboardList} color="green"  subtitle="A tu área" />
        <StatCard title="En progreso" value={MOCK_STATS.in_progress} icon={Clock}         color="yellow" subtitle="Trabajando" />
        <StatCard title="Resueltos"   value={MOCK_STATS.resolved}    icon={CheckCircle}   color="green"  subtitle="Este mes" />
        <StatCard title="Críticos"    value={MOCK_STATS.critical}    icon={AlertTriangle} color="red"    subtitle="Requieren atención" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Mis incidentes</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#6b7280', fontSize: 12 }}>{v}</span>} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">Mis incidentes asignados</h2>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white">
              <option value="">Todos</option>
              <option value="open">Abierto</option>
              <option value="in_progress">En progreso</option>
              <option value="resolved">Resuelto</option>
            </select>
          </div>
          <IncidentTable incidents={filtered} isLoading={false} />
        </div>
      </div>
    </div>
  )
}

function OperatorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useUser()
  const role = user?.publicMetadata?.role

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="operator" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <Menu size={22} />
          </button>

          {/* Botón Volver a Superadmin (solo si es superadmin) */}
          {role === 'superadmin' && (
            <button
              onClick={() => navigate('/superadmin')}
              className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
            >
              👑 Volver a Superadmin
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Empleado Municipal
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route index element={<OperatorHome />} />
            <Route path="asignados" element={<OperatorHome />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function OperatorDashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <OperatorLayout />
    </QueryClientProvider>
  )
}