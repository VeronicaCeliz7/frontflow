import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { assignIncidentOperator } from '../services/municipalityApi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface Operador {
  _id?: string
  id?: string
  clerkUserId: string
  nombre?: string
  apellido?: string
  nombreCompleto?: string
  email?: string
  municipio?: string
  rol?: string
}

interface Props {
  incident: any
  open: boolean
  onClose: () => void
}

export default function IncidentDetailModal({
  incident,
  open,
  onClose
}: Props) {
  const { getToken } = useAuth()

  const [operadores, setOperadores] = useState<Operador[]>([])
  const [operadorSeleccionado, setOperadorSeleccionado] = useState('')
  const [cargandoOperadores, setCargandoOperadores] = useState(false)
  const [asignando, setAsignando] = useState(false)

  useEffect(() => {
    if (!open || !incident?.municipio) return

    const cargarOperadores = async () => {
      try {
        setCargandoOperadores(true)

        const token = await getToken()

        if (!token) {
          setOperadores([])
          return
        }

        const { data } = await axios.get(
          `${API_URL}/api/users/municipio/lista?municipio=${incident.municipio}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        const lista = data.usuarios || data.data || data || []

        setOperadores(lista)

        if (lista.length > 0) {
          setOperadorSeleccionado(lista[0].clerkUserId)
        }
      } catch (error) {
        console.error('Error cargando operadores:', error)
        setOperadores([])
      } finally {
        setCargandoOperadores(false)
      }
    }

    cargarOperadores()
  }, [open, incident?.municipio, getToken])

  if (!open || !incident) return null

  const puedeAsignar =
    !incident.operadorAsignadoId &&
    ['pendiente', 'reportado', 'validacion_inicial', 'aceptado'].includes(incident.estado)

  const nombreOperador = (op: Operador) => {
    const nombreCompleto =
      op.nombreCompleto ||
      `${op.nombre || ''} ${op.apellido || ''}`.trim()

    if (nombreCompleto) return nombreCompleto
    if (op.email) return op.email
    return op.clerkUserId
  }

  const handleAsignarOperador = async () => {
    try {
      if (!operadorSeleccionado) {
        alert('Seleccioná un operador')
        return
      }

      setAsignando(true)

      const token = await getToken()

      if (!token) {
        alert('No se pudo obtener token')
        return
      }

      const operador = operadores.find(
        op => op.clerkUserId === operadorSeleccionado
      )

      const operadorNombre = operador
        ? nombreOperador(operador)
        : operadorSeleccionado

      await assignIncidentOperator(token, {
        id: incident._id,
        operadorId: operadorSeleccionado,
        operadorNombre
      })

      alert('Incidente asignado correctamente')
      onClose()
      window.location.reload()
    } catch (error: any) {
      alert(
        error?.response?.data?.error ||
        'Error al asignar operador'
      )
    } finally {
      setAsignando(false)
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
            {new Date(incident.createdAt).toLocaleDateString('es-AR')}
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

        {puedeAsignar && (
          <div className="mt-6 space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Seleccionar operador municipal
            </label>

            {cargandoOperadores ? (
              <p className="text-sm text-gray-500">
                Cargando operadores...
              </p>
            ) : operadores.length === 0 ? (
              <p className="text-sm text-red-500">
                No hay operadores activos para este municipio.
              </p>
            ) : (
              <div className="flex gap-3">
                <select
                  value={operadorSeleccionado}
                  onChange={(e) => setOperadorSeleccionado(e.target.value)}
                  className="
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    min-w-[260px]
                  "
                >
                  {operadores.map((op) => (
                    <option
                      key={op.clerkUserId}
                      value={op.clerkUserId}
                    >
                      {nombreOperador(op)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAsignarOperador}
                  disabled={asignando || !operadorSeleccionado}
                  className="
                    bg-blue-600
                    text-white
                    px-4
                    py-2
                    rounded-lg
                    disabled:opacity-50
                  "
                >
                  {asignando ? 'Asignando...' : 'Asignar operador'}
                </button>
              </div>
            )}
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