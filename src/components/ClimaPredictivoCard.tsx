import { useEffect, useState } from 'react'
import { CloudSun, Droplets, Wind, Thermometer, AlertTriangle, ShieldCheck } from 'lucide-react'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`

type RiesgoClimatico = {
  ok: boolean
  fuente: string
  ubicacion: {
    ciudad: string
    provincia: string
    pais: string
  }
  ventana: string
  pronostico: {
    lluvia24h: number
    vientoMaxKmh: number
    temperaturaMax: number
    temperaturaMin: number
  }
  prediccion_urbana: {
    riesgo_general: 'bajo' | 'medio' | 'alto' | 'critico'
    score: number
    alertas: string[]
    incidentes_probables: string[]
  }
}

function estiloRiesgo(riesgo?: string) {
  switch (riesgo) {
    case 'critico':
      return {
        label: 'Crítico',
        className: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-300 dark:border-red-800',
        icon: AlertTriangle
      }
    case 'alto':
      return {
        label: 'Alto',
        className: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        icon: AlertTriangle
      }
    case 'medio':
      return {
        label: 'Medio',
        className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
        icon: AlertTriangle
      }
    default:
      return {
        label: 'Bajo',
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        icon: ShieldCheck
      }
  }
}

export default function ClimaPredictivoCard() {
  const [data, setData] = useState<RiesgoClimatico | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/clima/riesgo`)
        const json = await response.json()
        setData(json)
      } catch (error) {
        console.error('Error cargando clima predictivo:', error)
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [])

  const riesgo = estiloRiesgo(data?.prediccion_urbana?.riesgo_general)
  const RiesgoIcon = riesgo.icon

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-100 dark:bg-blue-950/50 p-2">
              <CloudSun size={20} className="text-blue-600 dark:text-blue-300" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Motor Predictivo Climático
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Riesgo urbano anticipado según clima y condiciones territoriales.
              </p>
            </div>
          </div>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${riesgo.className}`}>
          <RiesgoIcon size={16} />
          Riesgo {riesgo.label}
        </div>
      </div>

      {loading ? (
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Consultando pronóstico predictivo...
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/30 p-3">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300 text-xs">
                <Droplets size={14} />
                Lluvia 24h
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                {data?.pronostico?.lluvia24h ?? 0} mm
              </p>
            </div>

            <div className="rounded-xl bg-cyan-50 dark:bg-cyan-950/30 p-3">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300 text-xs">
                <Wind size={14} />
                Viento máx.
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                {data?.pronostico?.vientoMaxKmh ?? 0} km/h
              </p>
            </div>

            <div className="rounded-xl bg-orange-50 dark:bg-orange-950/30 p-3">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-300 text-xs">
                <Thermometer size={14} />
                Temp. máx.
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                {data?.pronostico?.temperaturaMax ?? 0} °C
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
                <Thermometer size={14} />
                Temp. mín.
              </div>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                {data?.pronostico?.temperaturaMin ?? 0} °C
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-gray-50 dark:bg-gray-800/70 p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Lectura predictiva
            </p>

            <div className="space-y-1">
              {(data?.prediccion_urbana?.alertas || []).map((alerta, index) => (
                <p key={index} className="text-sm text-gray-700 dark:text-gray-200">
                  • {alerta}
                </p>
              ))}
            </div>

            {data?.prediccion_urbana?.incidentes_probables?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.prediccion_urbana.incidentes_probables.map((incidente) => (
                  <span
                    key={incidente}
                    className="rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2 py-1 text-xs font-medium"
                  >
                    {incidente}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  )
}