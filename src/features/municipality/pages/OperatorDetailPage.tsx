import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { X } from 'lucide-react'

interface Reporte {
  _id: string
  titulo: string
  direccion: string
  estado: string
  prioridad?: string
  createdAt: string
  columna_unica?: string
  observaciones?: string
  categoria?: string
  categoria_asignada_por_ia?: string
  municipio?: string
  localidad?: string
  latitud?: number
  longitud?: number
  archivo_url?: string
  archivo_tipo?: 'image' | 'video' | null
  operadorAsignadoId?: string
  operadorAsignadoNombre?: string
}

interface Operador {
  id: string
  clerkUserId: string
  nombre: string
  apellido: string
  nombreCompleto: string
  email: string
  role: string
  municipio: string
  activo: boolean
  createdAt: string
  ultimoAcceso: string | null
}

export default function OperatorDetailPage() {
  const { id } = useParams()
  const { getToken } = useAuth()

  const [reportes, setReportes] = useState<Reporte[]>([])
  const [operador, setOperador] = useState<Operador | null>(null)
  const [reporteSeleccionado, setReporteSeleccionado] = useState<Reporte | null>(null)
  const [loading, setLoading] = useState(true)

  const [filtroEstado, setFiltroEstado] = useState('todos')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  const cargarReportesOperador = async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        `${API_URL}/api/reportes?operadorId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      setReportes(data.data || [])
    } catch (error) {
      console.error('Error cargando reportes del operador:', error)
    }
  }

  const cargarOperador = async () => {
    try {
      const token = await getToken()

      const response = await fetch(
        `${API_URL}/api/users/municipio/lista?municipio=villa-maria`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()
      const encontrado = (data.usuarios || []).find(
        (u: Operador) => u.clerkUserId === id || u.id === id
      )

      setOperador(encontrado || null)
    } catch (error) {
      console.error('Error cargando operador:', error)
    }
  }

  const cargarDatos = async () => {
    setLoading(true)

    await Promise.all([
      cargarReportesOperador(),
      cargarOperador()
    ])

    setLoading(false)
  }

  useEffect(() => {
    if (id) {
      cargarDatos()
    }
  }, [id])

  const total = reportes.length
  const resueltos = reportes.filter(r => r.estado === 'resuelto').length
  const enProceso = reportes.filter(r => r.estado === 'en_proceso').length
  const pendientes = reportes.filter(r =>
    ['pendiente', 'reportado', 'validacion_inicial', 'aceptado', 'asignado'].includes(r.estado)
  ).length

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return '-'

    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatearFechaHora = (fecha?: string | null) => {
    if (!fecha) return '-'

    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const estadoLabel = (estado: string) => {
    const labels: Record<string, string> = {
      pendiente: 'Pendiente',
      reportado: 'Reportado',
      validacion_inicial: 'Validación inicial',
      aceptado: 'Aceptado',
      asignado: 'Asignado',
      en_proceso: 'En proceso',
      resuelto: 'Resuelto',
      verificado: 'Verificado',
      cerrado: 'Cerrado',
      rechazado: 'Rechazado',
      duplicado: 'Duplicado',
      informacion_insuficiente: 'Información insuficiente',
      fuera_de_jurisdiccion: 'Fuera de jurisdicción'
    }

    return labels[estado] || estado
  }

  const prioridadLabel = (prioridad?: string) => {
    const labels: Record<string, string> = {
      baja: 'Baja',
      media: 'Media',
      alta: 'Alta',
      critica: 'Crítica'
    }

    return prioridad ? labels[prioridad] || prioridad : '-'
  }
const reportesFiltrados = reportes.filter((r) => {
  if (filtroEstado === 'todos') return true

  if (filtroEstado === 'pendientes') {
    return [
      'reportado',
      'validacion_inicial',
      'aceptado',
      'asignado',
      'pendiente'
    ].includes(r.estado)
  }

  if (filtroEstado === 'en_proceso') {
    return r.estado === 'en_proceso'
  }

  if (filtroEstado === 'resueltos') {
    return ['resuelto', 'verificado', 'cerrado'].includes(r.estado)
  }

  if (filtroEstado === 'criticos') {
    return r.prioridad === 'critica'
  }

  return true
})
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Vista del operador
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Operador seleccionado:{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {operador?.nombreCompleto || operador?.nombre || id}
          </span>
        </p>
        {operador?.email && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {operador.email}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-none">
        <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Información general
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Incidentes asignados</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{total}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Pendientes</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{pendientes}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">En proceso</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{enProceso}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Resueltos</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{resueltos}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800 shadow-none">
        <h2 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Incidentes asignados al operador
        </h2>
<div className="flex flex-wrap gap-2 mb-4">
  {[
    { key: 'todos', label: 'Todos' },
    { key: 'pendientes', label: 'Pendientes' },
    { key: 'en_proceso', label: 'En proceso' },
    { key: 'resueltos', label: 'Resueltos' },
    { key: 'criticos', label: 'Críticos' }
  ].map((filtro) => (
    <button
      key={filtro.key}
      onClick={() => setFiltroEstado(filtro.key)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
        filtroEstado === filtro.key
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {filtro.label}
    </button>
  ))}
</div>
        {loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">Cargando incidentes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Este operador todavía no tiene incidentes asignados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Título</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Dirección</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Estado</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Prioridad</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Creado</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reportesFiltrados.map((reporte) => (
                  <tr
                    key={reporte._id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                      {reporte.titulo}
                    </td>

                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                      {reporte.direccion}
                    </td>

                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                      {estadoLabel(reporte.estado)}
                    </td>

                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                      {prioridadLabel(reporte.prioridad)}
                    </td>

                    <td className="py-3 px-2 text-gray-500 dark:text-gray-400">
                      {formatearFecha(reporte.createdAt)}
                    </td>

                    <td className="py-3 px-2">
                      <button
                        onClick={() => setReporteSeleccionado(reporte)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

     {reporteSeleccionado && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    onClick={() => setReporteSeleccionado(null)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl"
    >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Detalle del incidente
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Información del incidente asignado al operador.
                </p>
              </div>

              <button
                onClick={() => setReporteSeleccionado(null)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs mb-1">Título</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {reporteSeleccionado.titulo}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Estado</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {estadoLabel(reporteSeleccionado.estado)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Prioridad</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {prioridadLabel(reporteSeleccionado.prioridad)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs mb-1">Dirección</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {reporteSeleccionado.direccion}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs mb-1">Descripción</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {reporteSeleccionado.columna_unica || '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Municipio / Localidad</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {reporteSeleccionado.municipio || reporteSeleccionado.localidad || '-'}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-1">Fecha de creación</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {formatearFechaHora(reporteSeleccionado.createdAt)}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs mb-1">Observaciones</p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {reporteSeleccionado.observaciones || '-'}
                </p>
              </div>

              {reporteSeleccionado.archivo_url && (
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-xs mb-2">Archivo ciudadano</p>

                  {reporteSeleccionado.archivo_tipo === 'video' ? (
                    <video
                      src={reporteSeleccionado.archivo_url}
                      controls
                      className="w-full max-h-72 rounded-md border border-gray-200 dark:border-gray-800"
                    />
                  ) : (
                    <img
                      src={reporteSeleccionado.archivo_url}
                      alt="Archivo del incidente"
                      className="w-full max-h-64 object-contain rounded-md"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setReporteSeleccionado(null)}
                className="px-5 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}