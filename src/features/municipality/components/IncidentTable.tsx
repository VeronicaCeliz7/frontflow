import { useState } from 'react'
import { useUpdateIncident } from '../hooks/useUpdateIncident'
import StatusBadge from './StatusBadge'
import { ChevronDown } from 'lucide-react'

interface Incident {
  _id: string
  titulo: string
  prioridad: string
  estado: string
  createdAt: string | Date

  categoria_asignada_por_ia?: string
  ai_priority_score?: number
  posible_duplicado?: boolean
  duplicado_score?: number
  duplicado_distancia_metros?: number | null
}

interface IncidentTableProps {
  incidents: Incident[]
  isLoading: boolean
  onView?: (incident: Incident) => void
}

const prioridadLabel = (prioridad?: string) => {
  if (prioridad === 'critica' || prioridad === 'crítica') return 'crítica'
  if (prioridad === 'alta') return 'alta'
  if (prioridad === 'media') return 'media'
  if (prioridad === 'baja') return 'baja'
  return 'N/A'
}

const prioridadClass = (prioridad?: string) => {
  if (prioridad === 'critica' || prioridad === 'crítica') {
    return 'bg-red-100 text-red-700'
  }

  if (prioridad === 'alta') {
    return 'bg-orange-100 text-orange-700'
  }

  if (prioridad === 'media') {
    return 'bg-blue-100 text-blue-700'
  }

  return 'bg-gray-100 text-gray-600'
}

export default function IncidentTable({
  incidents = [],
  isLoading,
  onView
}: IncidentTableProps) {
  const { mutate: updateStatus } = useUpdateIncident()

  const [changingId, setChangingId] = useState<string | null>(null)

  const handleStatusChange = (id: string, newStatus: string) => {
    setChangingId(id)

    updateStatus(
      { id, status: newStatus },
      {
        onSettled: () => setChangingId(null)
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!incidents.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        No hay incidentes para mostrar
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {[
              'ID',
              'Título',
              'IA',
              'Prioridad',
              'Estado',
              'Fecha',
              'Cambiar estado'
            ].map((header) => (
              <th
                key={header}
                className="text-left py-3 px-2 text-gray-400 font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {incidents.map((inc) => (
            <tr
              key={inc._id}
              onClick={() => onView?.(inc)}
              className="
                border-b
                border-gray-50
                hover:bg-gray-50
                transition-colors
                cursor-pointer
              "
            >
              <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                #{inc._id?.slice(-5).toUpperCase()}
              </td>

              <td className="py-3 px-2 font-medium text-gray-700 max-w-[200px] truncate">
                {inc.titulo}
              </td>

              <td className="py-3 px-2">
                <div className="flex flex-col gap-1 text-xs min-w-[145px]">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-medium">
                    {inc.categoria_asignada_por_ia || 'Sin IA'}
                  </span>

                  {typeof inc.ai_priority_score === 'number' && (
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 font-medium">
                      Score IA {inc.ai_priority_score}/100
                    </span>
                  )}

                  {inc.posible_duplicado && (
                    <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 font-medium">
                      Duplicado
                      {typeof inc.duplicado_distancia_metros === 'number'
                        ? ` · ${inc.duplicado_distancia_metros} m`
                        : ''}
                    </span>
                  )}
                </div>
              </td>

              <td className="py-3 px-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${prioridadClass(
                    inc.prioridad
                  )}`}
                >
                  {prioridadLabel(inc.prioridad)}
                </span>
              </td>

              <td className="py-3 px-2">
                <StatusBadge status={inc.estado} />
              </td>

              <td className="py-3 px-2 text-gray-400">
                {new Date(inc.createdAt).toLocaleDateString('es-AR')}
              </td>

              <td
                className="py-3 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative inline-block">
                  <select
                    value={inc.estado}
                    disabled={changingId === inc._id}
                    onChange={(e) =>
                      handleStatusChange(
                        inc._id,
                        e.target.value
                      )
                    }
                    className="
                      appearance-none
                      bg-white
                      border
                      border-gray-200
                      rounded-lg
                      px-3
                      py-1.5
                      pr-7
                      text-xs
                      text-gray-600
                      cursor-pointer
                      hover:border-blue-400
                      transition-colors
                      disabled:opacity-50
                    "
                  >
<option value="pendiente">Pendiente</option>
<option value="asignado" disabled>Asignado</option>
<option value="en_proceso">En proceso</option>
<option value="resuelto">Resuelto</option>
<option value="rechazado">Rechazado</option>
                  </select>

                  <ChevronDown
                    size={12}
                    className="
                      absolute
                      right-2
                      top-2.5
                      text-gray-400
                      pointer-events-none
                    "
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}