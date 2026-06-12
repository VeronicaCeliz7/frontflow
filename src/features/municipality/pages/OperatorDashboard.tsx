import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Menu, Building2, HardHat, User, Crown } from 'lucide-react'
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { useAuth, useUser } from '@clerk/clerk-react'

import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import { useIncidents } from '../hooks/useIncidents'
import { takeIncident, updateIncidentStatus } from '../services/municipalityApi'

import AIInsightCard from '../../../components/AIInsightCard';

import ClimaPredictivoCard from '../../../components/ClimaPredictivoCard'
import IAHeatmap from '../../../components/IAHeatmap'

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
    ? { municipio, sinAsignar: 'true' }
    : { operadorId }

  const { data, isLoading } = useIncidents(filtros)
   console.log('FILTROS OPERADOR:', filtros)
   console.log('DATA OPERADOR:', data)
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
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Hola, {nombreOperador || 'Operador'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
          Gestión de incidentes del municipio: {municipio}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pendientes" value={pendientes} icon={ClipboardList} color="yellow" subtitle="Sin asignar" />
        <StatCard title="En proceso" value={enProceso} icon={Clock} color="blue" subtitle="Gestionando" />
        <StatCard title="Resueltos" value={resueltos} icon={CheckCircle} color="green" subtitle="Finalizados" />
        <StatCard title="Críticos" value={criticos} icon={AlertTriangle} color="red" subtitle="Alta prioridad" />
      </div>

<div className="mt-5">
  <ClimaPredictivoCard />
</div>

<div className="mt-5">
  <IAHeatmap />
</div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            {vista === 'pendientes'
              ? 'Incidentes pendientes del municipio'
              : 'Mis incidentes asignados'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setVista('pendientes')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                vista === 'pendientes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setVista('mios')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                vista === 'mios'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Mis incidentes
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando incidentes...</p>
        ) : incidents.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No hay incidentes para mostrar.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Título</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Dirección</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Estado</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Municipio</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Operador</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium min-w-[180px]">Motor IA</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Acción</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incidente: any) => (
                  <tr key={incidente._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-3 px-2 font-medium text-gray-900 dark:text-gray-100">{incidente.titulo}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{incidente.direccion}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300 capitalize">{incidente.estado}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{incidente.municipio || '-'}</td>
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">{incidente.operadorAsignadoNombre || 'Sin asignar'}</td>
                    
                    <td className="py-3 px-2">
                    <div className="flex flex-col gap-1 text-xs">

                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">
                        {incidente.categoria_asignada_por_ia || 'Sin IA'}
                      </span>

                      <span
                        className={`px-2 py-1 rounded font-medium ${
                          incidente.prioridad === 'critica'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : incidente.prioridad === 'alta'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
                            : incidente.prioridad === 'media'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {incidente.prioridad === 'critica'
                        ? 'crítica'
                        : incidente.prioridad === 'alta'
                        ? 'alta'
                        : incidente.prioridad === 'media'
                        ? 'media'
                        : incidente.prioridad === 'baja'
                        ? 'baja'
                        : 'N/A'}
                      </span>

                      {incidente.posible_duplicado && (
                        <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-medium">
                          Duplicado
                        </span>
                      )}

                    </div>
                  </td>

                    <td className="py-3 px-2">
                      {vista === 'pendientes' && incidente.estado === 'pendiente' && !incidente.operadorAsignadoId ? (
                        <button
                          onClick={() => tomarIncidente(incidente._id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                        >
                          Tomar incidente
                        </button>
                      ) : (
                        <select
                          value={incidente.estado}
                          onChange={(e) => cambiarEstado(incidente._id, e.target.value)}
                          className="border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-xs bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
  const isOperator = role === 'operator' || role === 'operador' || roles.includes('operator') || roles.includes('operador')

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} role="operator" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <Menu size={20} />
          </button>

          <div className="flex gap-2 ml-4">
            {(isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/admin')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Building2 size={14} />
                Administrador
              </button>
            )}
            {(isOperator || isAdmin || isSuperAdmin) && (
              <button
                onClick={() => navigate('/municipality/operator')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 ${
                  location.pathname.startsWith('/municipality/operator')
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
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
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-1.5"
              >
                <Crown size={14} />
                Superadministrador
              </button>
            )}
          </div>

          {!isSuperAdmin && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full">
                Empleado Municipal
              </span>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4">
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