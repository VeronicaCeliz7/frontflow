import { Brain, AlertTriangle, Tags, GitMerge, MapPin, Activity } from 'lucide-react';
import { Reporte } from '../types/reporte';

interface AIInsightCardProps {
  reporte: Reporte;
  compact?: boolean;
  role?: 'ciudadano' | 'admin' | 'operador' | 'super';
}

const getPriorityClass = (prioridad?: string) => {
  switch (prioridad) {
    case 'critica':
      return 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'alta':
      return 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'media':
      return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'baja':
      return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    default:
      return 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

const formatPriority = (prioridad?: string) => {
  if (!prioridad) return 'Sin prioridad';
  if (prioridad === 'critica') return 'Crítica';
  return prioridad.charAt(0).toUpperCase() + prioridad.slice(1);
};

export default function AIInsightCard({
  reporte,
  compact = false,
  role = 'ciudadano'
}: AIInsightCardProps) {
  const showTechnical = role === 'admin' || role === 'operador' || role === 'super';

  if (!reporte.ia_procesado && !reporte.categoria_asignada_por_ia) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Brain size={16} />
          IA pendiente de procesamiento
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/70 dark:bg-indigo-950/20 p-4">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
            <Brain size={17} />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
              Inteligencia Artificial
            </p>
            <p className="text-xs text-indigo-700 dark:text-indigo-300">
              Clasificación automática del incidente
            </p>
          </div>
        </div>

        <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          IA procesada
        </span>
      </div>

      <div className={compact ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-3'}>
        <div className="rounded-md bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Categoría IA</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
            {reporte.categoria_asignada_por_ia || 'Sin categoría'}
          </p>
        </div>

        <div className={`rounded-md border p-3 ${getPriorityClass(reporte.prioridad)}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} />
            <div>
              <p className="text-xs opacity-80">Prioridad IA</p>
              <p className="text-sm font-bold">
                {formatPriority(reporte.prioridad)}
                {typeof reporte.ai_priority_score === 'number' && (
                  <span className="ml-1 font-medium">
                    · {reporte.ai_priority_score}/100
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {reporte.ai_summary && !compact && (
        <div className="mt-3 rounded-md bg-white dark:bg-gray-900 border border-indigo-100 dark:border-indigo-900 p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resumen IA</p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {reporte.ai_summary}
          </p>
        </div>
      )}

      {!!reporte.etiquetas?.length && !compact && (
        <div className="mt-3">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            <Tags size={14} />
            Etiquetas inteligentes
          </div>
          <div className="flex flex-wrap gap-2">
            {reporte.etiquetas.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2.5 py-1 text-xs text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {reporte.posible_duplicado && (
        <div className="mt-3 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
          <div className="flex items-start gap-2">
            <GitMerge size={16} className="text-amber-700 dark:text-amber-300 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                Posible incidente duplicado
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                El sistema detectó un reporte similar en la misma zona.
              </p>

              {showTechnical && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {typeof reporte.duplicado_score === 'number' && (
                    <span className="rounded-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 px-2 py-1 text-xs text-amber-700 dark:text-amber-300">
                      Score: {reporte.duplicado_score}
                    </span>
                  )}

                  {typeof reporte.duplicado_distancia_metros === 'number' && (
                    <span className="rounded-full bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 px-2 py-1 text-xs text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <MapPin size={12} />
                      {reporte.duplicado_distancia_metros} m
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showTechnical && !compact && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Proveedor IA</p>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {reporte.proveedor_ia || 'No informado'}
            </p>
          </div>

          <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">Modelo IA</p>
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">
              {reporte.modelo_ia || 'No informado'}
            </p>
          </div>

          <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <Activity size={13} className="text-gray-500" />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Vectorización: {reporte.vectorizado ? `procesada con ${reporte.vector_modelo}` : 'preparada para motor semántico futuro'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}