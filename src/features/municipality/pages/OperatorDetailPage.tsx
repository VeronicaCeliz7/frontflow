import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

interface Reporte {
  _id: string
  titulo: string
  direccion: string
  estado: string
  prioridad?: string
  createdAt: string
}

export default function OperatorDetailPage() {
  const { id } = useParams()
  const { getToken } = useAuth()

  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)

  const cargarReportesOperador = async () => {
    try {
      const token = await getToken()
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      cargarReportesOperador()
    }
  }, [id])

  const total = reportes.length
  const resueltos = reportes.filter(r => r.estado === 'resuelto').length
  const enProceso = reportes.filter(r => r.estado === 'en_proceso').length
  const pendientes = reportes.filter(r => r.estado === 'pendiente').length

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Vista del operador
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Operador seleccionado: {id}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">

        <h2 className="font-semibold mb-4 text-gray-700">
          Información general
        </h2>

        <div className="grid md:grid-cols-4 gap-4">

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Incidentes asignados</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-red-600">{pendientes}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">En proceso</p>
            <p className="text-2xl font-bold text-yellow-600">{enProceso}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Resueltos</p>
            <p className="text-2xl font-bold text-green-600">{resueltos}</p>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="font-semibold mb-4 text-gray-700">
          Incidentes asignados al operador
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando incidentes...</p>
        ) : reportes.length === 0 ? (
          <p className="text-sm text-gray-500">
            Este operador todavía no tiene incidentes asignados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Título</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Dirección</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Estado</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Prioridad</th>
                </tr>
              </thead>

              <tbody>
                {reportes.map((reporte) => (
                  <tr key={reporte._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-700">{reporte.titulo}</td>
                    <td className="py-3 px-2 text-gray-500">{reporte.direccion}</td>
                    <td className="py-3 px-2 text-gray-500">{reporte.estado}</td>
                    <td className="py-3 px-2 text-gray-500">{reporte.prioridad || '-'}</td>
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