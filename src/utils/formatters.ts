// src/utils/formatters.ts

export interface ChartDatum {
  key: string;
  label: string;
  value: number;
}

const LABELS_CONOCIDOS: Record<string, string> = {
  // Estados del workflow
  reportado: 'Reportado',
  pendiente: 'Pendiente',
  validacion_inicial: 'Validación inicial',
  informacion_insuficiente: 'Información insuficiente',
  aceptado: 'Aceptado',
  asignado: 'Asignado',
  en_proceso: 'En proceso',
  resuelto: 'Resuelto',
  verificado: 'Verificado',
  cerrado: 'Cerrado',
  rechazado: 'Rechazado',
  duplicado: 'Duplicado',
  fuera_de_jurisdiccion: 'Fuera de jurisdicción',

  // Prioridades
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

export function normalizeRawKey(rawKey?: string | null): string {
  if (!rawKey || typeof rawKey !== 'string') return 'sin_dato';
  return rawKey.trim().toLowerCase();
}

export function formatDimensionLabel(rawKey?: string | null, fallbackLabel = 'Sin dato'): string {
  const normalized = normalizeRawKey(rawKey);
  if (normalized === 'sin_dato') return fallbackLabel;

  if (LABELS_CONOCIDOS[normalized]) {
    return LABELS_CONOCIDOS[normalized];
  }

  // Transformación genérica para claves tipo "animal_suelto" -> "Animal suelto"
  const readable = normalized
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!readable) return fallbackLabel;
  return readable.charAt(0).toUpperCase() + readable.slice(1);
}

export function adaptMongoTotals(
  items: Array<{ _id?: string | null; total?: number | null }> = [],
  options?: { sortDesc?: boolean; limit?: number; fallbackLabel?: string }
): ChartDatum[] {
  const { sortDesc = true, limit, fallbackLabel = 'Sin dato' } = options || {};

  const adapted = items.map((item) => {
    const key = normalizeRawKey(item?._id);
    const label = formatDimensionLabel(item?._id, fallbackLabel);
    const value = typeof item?.total === 'number' && Number.isFinite(item.total) ? item.total : 0;
    return { key, label, value };
  });

  const ordered = sortDesc ? [...adapted].sort((a, b) => b.value - a.value) : adapted;
  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered;
}