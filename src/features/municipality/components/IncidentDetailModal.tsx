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

  if (!open || !incident) return null

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
          <p>
            <strong>ID:</strong> {incident._id}
          </p>

          <p>
            <strong>Estado:</strong> {incident.estado}
          </p>

          <p>
            <strong>Prioridad:</strong> {incident.prioridad}
          </p>

          <p>
            <strong>Fecha:</strong>
            {' '}
            {new Date(
              incident.createdAt
            ).toLocaleDateString()}
          </p>
        </div>

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