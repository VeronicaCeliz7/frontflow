import { useAuth } from '@clerk/clerk-react'
import { assignIncidentOperator } from '../services/municipalityApi'

interface Props {
  incident: any
  open: boolean
  onClose: () => void
}

const ANA_OPERADOR_ID = 'user_3EYCEUUUVVGYbEFsl9KzMBUC2cb'

export default function IncidentDetailModal({
  incident,
  open,
  onClose
}: Props) {
  const { getToken } = useAuth()

  if (!open || !incident) return null

  const handleAsignarAna = async () => {
    try {
      const token = await getToken()

      if (!token) {
        alert('No se pudo obtener token')
        return
      }

      await assignIncidentOperator(token, {
        id: incident._id,
        operadorId: ANA_OPERADOR_ID
      })

      alert('Incidente asignado correctamente')
      onClose()
      window.location.reload()
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
        'Error al asignar operador'
      )
    }
  }

  return (
    <div className="
      fixed inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
    ">
      <div className="
        bg-white
        rounded-2xl
        p-6
        w-full
        max-w-2xl
      ">
        <h2 className="text-xl font-bold">
          {incident.titulo}
        </h2>

        <div className="mt-4 space-y-2">
          <p><strong>ID:</strong> {incident._id}</p>
          <p><strong>Estado:</strong> {incident.estado}</p>
          <p><strong>Prioridad:</strong> {incident.prioridad}</p>

          <p>
            <strong>Fecha:</strong>{' '}
            {new Date(incident.createdAt).toLocaleDateString()}
          </p>

          <p>
            <strong>Operador:</strong>{' '}
            {incident.operadorAsignadoNombre || 'Sin asignar'}
          </p>

          <p>
            <strong>Municipio:</strong>{' '}
            {incident.municipio}
          </p>
        </div>

        {!incident.operadorAsignadoId && incident.estado === 'pendiente' && (
          <div className="mt-6">
            <button
              onClick={handleAsignarAna}
              className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-lg
              "
            >
              Asignar a Ana NN
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="
              bg-gray-200
              px-4
              py-2
              rounded-lg
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}