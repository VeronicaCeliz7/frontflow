export default function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string, className: string }> = {
    open:        { label: 'Abierto',     className: 'bg-red-100 text-red-700' },
    in_progress: { label: 'En progreso', className: 'bg-yellow-100 text-yellow-700' },
    resolved:    { label: 'Resuelto',    className: 'bg-green-100 text-green-700' },
  }

  const { label, className } = config[status] || { label: status, className: 'bg-gray-100 text-gray-700' }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
      {label}
    </span>
  )
}