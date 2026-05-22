import { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  value: number
  icon: LucideIcon
  color?: 'blue' | 'green' | 'yellow' | 'red'
  subtitle?: string
}

export default function StatCard({ title, value, icon: Icon, color = 'blue', subtitle }: Props) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'bg-blue-600',   text: 'text-blue-600' },
    green:  { bg: 'bg-green-50',  icon: 'bg-green-600',  text: 'text-green-600' },
    yellow: { bg: 'bg-yellow-50', icon: 'bg-yellow-500', text: 'text-yellow-600' },
    red:    { bg: 'bg-red-50',    icon: 'bg-red-600',    text: 'text-red-600' },
  }

  const c = colors[color]

  return (
    <div className={`rounded-2xl p-5 ${c.bg} flex items-center gap-4`}>
      <div className={`${c.icon} p-3 rounded-xl`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className={`text-2xl font-bold ${c.text}`}>{value ?? '—'}</p>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  )
}