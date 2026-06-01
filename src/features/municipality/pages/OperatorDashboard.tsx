import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Menu } from 'lucide-react'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useAuth, useUser } from '@clerk/clerk-react'

import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { useIncidents } from '../hooks/useIncidents'
import { takeIncident, updateIncidentStatus } from '../services/municipalityApi'

const queryClient = new QueryClient()

function OperatorHome() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const nombreOperador = `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
  const municipio = (user?.publicMetadata?.municipio as string) || 'villa-maria'
  const operadorId = user?.id || ''

  const [vista, setVista] = useState<'pendientes' | 'mios'>('pendientes')

  const filtros =
    vista === 'pendientes'
      ? { municipio, estado: 'pendiente', sinAsignar: 'true' }
      : { operadorId }

  const { data, isLoading } = useIncidents(filtros)

  const incidents = data?.data || []

  const tomarIncidente = async (id: string) => {
    try {
      const token = await getToken()
      if (!token) return alert('Token no encontrado')

      await takeIncident(token, id)
      await queryClient.invalidateQueries({ queryKey: ['incidents'] })

      alert('Incidente tomado correctamente')
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Error al tomar incidente')
    }
  }

  const cambiarEstado = async (id: string, status: string) => {
    try {
      const token = await getToken()
      if (!token) return alert('Token no encontrado')

      await updateIncidentStatus(token, { id, status })
      await queryClient.invalidateQueries({ queryKey: ['incidents'] })

      alert('Estado actualizado')
    } catch (error: any) {
      alert(error?.response?.data?.error || 'Error al actualizar estado')
    }
  }

  const pendientes = incidents.filter((i: any) => i.estado === 'pendiente').length
  const enProceso = incidents.filter((i: any) => i.estado === 'en_proceso').length
  const resueltos = incidents.filter((i: any) => i.estado === 'resuelto').length
  const criticos = incidents.filter((i: any) => i.prioridad === 'critica').length

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Hola, {nombreOperador || 'Operador'} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Gestión de incidentes del municipio: {municipio}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pendientes" value={pendientes} icon={ClipboardList} color="yellow" subtitle="Sin asignar" />
        <StatCard title="En proceso" value={enProceso} icon={Clock} color="blue" subtitle="Gestionando" />
        <StatCard title="Resueltos" value={resueltos} icon={CheckCircle} color="green" subtitle="Finalizados" />
        <StatCard title="Críticos" value={criticos} icon={AlertTriangle} color="red" subtitle="Alta prioridad" />
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">
            {vista === 'pendientes'
              ? 'Incidentes pendientes del municipio'
              : 'Mis incidentes asignados'}
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => setVista('pendientes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                vista === 'pendientes'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Pendientes
            </button>

            <button
              onClick={() => setVista('mios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                vista === 'mios'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Mis incidentes
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Cargando incidentes...</p>
        ) : incidents.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay incidentes para mostrar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Título</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Dirección</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Estado</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Municipio</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Operador</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Acción</th>
                </tr>
              </thead>

              <tbody>
                {incidents.map((incidente: any) => (
                  <tr key={incidente._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-700">
                      {incidente.titulo}
                    </td>

                    <td className="py-3 px-2 text-gray-500">
                      {incidente.direccion}
                    </td>

                    <td className="py-3 px-2 text-gray-500">
                      {incidente.estado}
                    </td>

                    <td className="py-3 px-2 text-gray-500">
                      {incidente.municipio || '-'}
                    </td>

                    <td className="py-3 px-2 text-gray-500">
                      {incidente.operadorAsignadoNombre || 'Sin asignar'}
                    </td>

                    <td className="py-3 px-2">
                      {vista === 'pendientes' && incidente.estado === 'pendiente' && !incidente.operadorAsignadoId ? (
                        <button
                          onClick={() => tomarIncidente(incidente._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                        >
                          Tomar incidente
                        </button>
                      ) : (
                        <select
                          value={incidente.estado}
                          onChange={(e) => cambiarEstado(incidente._id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en_proceso">En proceso</option>
                          <option value="resuelto">Resuelto</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function OperatorLayout() {
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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="operator" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <Menu size={22} />
          </button>

          <div className="flex gap-2 ml-4">

            {(isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/admin')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                🏛️ Administrador
              </button>
            )}

            {(isOperator || isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/operator')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  location.pathname.startsWith('/municipality/operator')
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👷 Operador
              </button>
            )}

            {(isAdmin || isOperator || isSuperAdmin) && (
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                🧑 Ciudadano
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => navigate('/superadmin')}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition"
              >
                👑 Superadministrador
              </button>
            )}

          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
                Empleado Municipal
              </span>
            </div>
          )}

        </header>

        <main className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route index element={<OperatorHome />} />
            <Route path="asignados" element={<OperatorHome />} />
            <Route path="reportes" element={<OperatorHome />} />
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