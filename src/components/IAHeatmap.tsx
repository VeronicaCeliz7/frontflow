import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import 'leaflet.heat'
import L from 'leaflet'

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`

type HeatmapPoint = {
  id: string
  titulo: string
  categoria: string
  prioridad: string
  estado: string
  municipio: string
  direccion: string
  latitud: number
  longitud: number
  intensidad: number
  vectorizado: boolean
}

type HeatmapResponse = {
  ok: boolean
  total: number
  vectorizados: number
  resumen: {
    categorias: Record<string, number>
    prioridades: Record<string, number>
  }
  puntos: HeatmapPoint[]
}

function HeatLayer({ points }: { points: HeatmapPoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (!points.length) return

    const heatPoints = points
      .filter((p) => p.latitud && p.longitud && p.latitud !== 0 && p.longitud !== 0)
      .map((p) => [
        p.latitud,
        p.longitud,
        Math.max(0.2, Math.min(1, p.intensidad / 100))
      ])

    const heatLayer = (L as any).heatLayer(heatPoints, {
      radius: 32,
      blur: 22,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: 'blue',
        0.4: 'lime',
        0.6: 'yellow',
        0.8: 'orange',
        1.0: 'red'
      }
    })

    heatLayer.addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points])

  return null
}

export default function IAHeatmap() {
  const [data, setData] = useState<HeatmapResponse | null>(null)
  const [categoria, setCategoria] = useState('')
  const [soloVectorizados, setSoloVectorizados] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()

        if (categoria) params.append('categoria', categoria)
        if (soloVectorizados) params.append('soloVectorizados', 'true')

        const response = await fetch(`${API_URL}/ia/heatmap?${params.toString()}`)
        const json = await response.json()

        setData(json)
      } catch (error) {
        console.error('Error cargando heatmap IA:', error)
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [categoria, soloVectorizados])

  const puntosValidos = useMemo(() => {
    return (data?.puntos || []).filter(
      (p) => p.latitud && p.longitud && p.latitud !== 0 && p.longitud !== 0
    )
  }, [data])

  const categorias = useMemo(() => {
    return Object.keys(data?.resumen?.categorias || {}).sort()
  }, [data])

  const centroMapa = useMemo(() => {
    if (!puntosValidos.length) return [-32.4108, -63.2436] as [number, number]

    const lat = puntosValidos.reduce((acc, p) => acc + p.latitud, 0) / puntosValidos.length
    const lng = puntosValidos.reduce((acc, p) => acc + p.longitud, 0) / puntosValidos.length

    return [lat, lng] as [number, number]
  }, [puntosValidos])

  return (
  <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Mapa de Calor Inteligente IA
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Zonas calientes por concentración, prioridad y score IA.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs text-gray-700 dark:text-gray-200"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={soloVectorizados}
            onChange={(e) => setSoloVectorizados(e.target.checked)}
          />
          Vectorizados
        </label>
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
      <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 px-3 py-2">
        <p className="text-[10px] text-indigo-600 dark:text-indigo-300">Incidentes</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {data?.total ?? 0}
        </p>
      </div>

      <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2">
        <p className="text-[10px] text-emerald-600 dark:text-emerald-300">Vectorizados</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {data?.vectorizados ?? 0}
        </p>
      </div>

      <div className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2">
        <p className="text-[10px] text-red-600 dark:text-red-300">Críticos</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {data?.resumen?.prioridades?.critica ?? 0}
        </p>
      </div>

      <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 px-3 py-2">
        <p className="text-[10px] text-purple-600 dark:text-purple-300">Categorías</p>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {Object.keys(data?.resumen?.categorias || {}).length}
        </p>
      </div>
    </div>

    <div className="h-[620px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
      {loading ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          Cargando mapa inteligente...
        </div>
      ) : (
        <MapContainer
          center={centroMapa}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <HeatLayer points={puntosValidos} />
        </MapContainer>
      )}
    </div>

    <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-500 dark:text-gray-400">
      <span>🟦 baja</span>
      <span>🟨 media</span>
      <span>🟥 crítica</span>
      <span>🧠 score IA</span>
    </div>
  </section>
)
}