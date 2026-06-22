import StatusBadge from './StatusBadge'

interface Incident {
  _id: string
  titulo: string
  prioridad: string
  estado: string
  createdAt: string | Date

  operadorAsignadoId?: string | null
  operadorAsignadoNombre?: string | null

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
  if (prioridad === 'critica' || prioridad === 'crítica') return 'bg-red-100 text-red-700'
  if (prioridad === 'alta') return 'bg-orange-100 text-orange-700'
  if (prioridad === 'media') return 'bg-blue-100 text-blue-700'
  if (prioridad === 'baja') return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

export default function IncidentTable({
  incidents = [],
  isLoading,
  onView
}: IncidentTableProps) {
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
            {['ID', 'Título', 'IA', 'Prioridad', 'Estado', 'Fecha', 'Responsable'].map((header) => (
              <th key={header} className="text-left py-3 px-2 text-gray-400 font-medium">
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
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="py-3 px-2 text-gray-400 font-mono text-xs">
                #{inc._id?.slice(-5).toUpperCase()}
              </td>

              <td className="py-3 px-2 font-medium text-gray-700 max-w-55 truncate">
                {inc.titulo}
              </td>

              <td className="py-3 px-2">
                <div className="space-y-1">
                  <div className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
                    {inc.categoria_asignada_por_ia || 'Sin IA'}
                  </div>

                  {typeof inc.ai_priority_score === 'number' && (
                    <div className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs">
                      Score IA {inc.ai_priority_score}/100
                    </div>
                  )}

                  {inc.posible_duplicado && (
                    <div className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs">
                      Duplicado
                      {typeof inc.duplicado_distancia_metros === 'number'
                        ? ` · ${inc.duplicado_distancia_metros} m`
                        : ''}
                    </div>
                  )}

                  {typeof inc.duplicado_score === 'number' && inc.duplicado_score > 0 && (
                    <div className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">
                      IA sugiere duplicado · {inc.duplicado_score}%
                    </div>
                  )}
                </div>
              </td>

              <td className="py-3 px-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${prioridadClass(inc.prioridad)}`}>
                  {prioridadLabel(inc.prioridad)}
                </span>
              </td>

              <td className="py-3 px-2">
                <StatusBadge status={inc.estado} />
              </td>

              <td className="py-3 px-2 text-gray-400">
                {new Date(inc.createdAt).toLocaleDateString('es-AR')}
              </td>

              <td className="py-3 px-2">
                {inc.operadorAsignadoNombre ? (
                  <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                    Asignado a {inc.operadorAsignadoNombre}
                  </span>
                ) : (
                  <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                    Sin operador
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}