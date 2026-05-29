import { useParams } from 'react-router-dom'

export default function OperatorDetailPage() {
  const { id } = useParams()

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">
          Vista del Operador
        </h1>

        <p className="text-gray-500">
          Operador seleccionado: {id}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6">

        <h2 className="font-semibold mb-4">
          Información General
        </h2>

        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Incidentes asignados
            </p>

            <p className="text-2xl font-bold">
              18
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              Resueltos
            </p>

            <p className="text-2xl font-bold text-green-600">
              42
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">
              En progreso
            </p>

            <p className="text-2xl font-bold text-yellow-600">
              7
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}