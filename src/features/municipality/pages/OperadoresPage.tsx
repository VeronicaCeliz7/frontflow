import { useNavigate } from 'react-router-dom'

const operadores = [
  {
    id: 'op1',
    nombre: 'Juan Pérez',
    asignados: 18,
    resueltos: 42
  },
  {
    id: 'op2',
    nombre: 'María López',
    asignados: 12,
    resueltos: 37
  },
  {
    id: 'op3',
    nombre: 'Carlos Ruiz',
    asignados: 9,
    resueltos: 28
  }
]

export default function OperadoresPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Operadores Municipales
        </h1>

        <p className="text-gray-400 mt-1">
          Personal asignado al municipio
        </p>
      </div>

      <div className="grid gap-4">
        {operadores.map(op => (
          <div
            key={op.id}
            className="bg-white border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-center">

              <div>
                <h2 className="font-semibold text-lg">
                  {op.nombre}
                </h2>

                <p className="text-sm text-gray-500">
                  Incidentes asignados: {op.asignados}
                </p>

                <p className="text-sm text-green-600">
                  Resueltos: {op.resueltos}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/municipality/admin/operadores/${op.id}`)
                }
                className="
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-blue-700
                "
              >
                Ver panel
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}