import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

interface Operador {
  id: string
  clerkUserId: string
  nombre: string
  email: string
  role: string
  municipio: string
}

export default function OperadoresPage() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { user } = useUser()

  const municipio =
    (user?.publicMetadata?.municipio as string) || 'villa-maria'

  const [operadores, setOperadores] = useState<Operador[]>([])
  const [loading, setLoading] = useState(true)

  const cargarOperadores = async () => {
    try {
      const token = await getToken()
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

      const response = await fetch(
        `${API_URL}/api/users/municipio/lista?municipio=${encodeURIComponent(municipio)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      const soloOperadores = (data.usuarios || []).filter(
        (u: Operador) => u.role === 'operador' || u.role === 'operator'
      )

      setOperadores(soloOperadores)
    } catch (error) {
      console.error('Error cargando operadores:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarOperadores()
  }, [municipio])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Operadores Municipales
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Personal asignado al municipio: {municipio}
        </p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando operadores...</p>
        ) : operadores.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-none">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Todavía no hay operadores creados para este municipio.
            </p>
          </div>
        ) : (
          operadores.map(op => (
            <div
              key={op.clerkUserId || op.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-none"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                    {op.nombre}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {op.email}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Municipio: {op.municipio}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigate(`/municipality/admin/operadores/${op.clerkUserId}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Ver panel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}