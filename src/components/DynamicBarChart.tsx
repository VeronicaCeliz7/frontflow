// src/components/DynamicBarChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { ChartDatum } from '../utils/formatters';
import { getSemanticColor, type SemanticDomain } from '../utils/colorStrategy';

interface DynamicBarChartProps {
  data: ChartDatum[];
  domain: SemanticDomain;
  layout?: 'horizontal' | 'vertical';
  emptyMessage?: string;
  yAxisWidth?: number;
  barSize?: number;
}

export default function DynamicBarChart({
  data,
  domain,
  layout = 'vertical',
  emptyMessage = 'No hay datos para mostrar.',
  yAxisWidth = 135,
  barSize = 22,
}: DynamicBarChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400">{emptyMessage}</p>;
  }

  const isHorizontalBars = layout === 'vertical';

  return (
    <ResponsiveContainer width="100%" height="100%">
      {isHorizontalBars ? (
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 24, left: 12, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={yAxisWidth}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip
            formatter={(value) => [value ?? 0, 'Incidentes']}
            labelFormatter={(label) => String(label ?? '')}
          />
          <Bar
            dataKey="value"
            radius={0}
            barSize={barSize}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={getSemanticColor(domain, entry.key)}
              />
            ))}
          </Bar>
        </BarChart>
      ) : (
        <BarChart
          layout="horizontal"
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.35} />
          <XAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <YAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <Tooltip
            formatter={(value) => [value ?? 0, 'Incidentes']}
            labelFormatter={(label) => String(label ?? '')}
          />
          <Bar
            dataKey="value"
            radius={0}
            barSize={barSize}
            isAnimationActive={false}
          >
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={getSemanticColor(domain, entry.key)}
              />
            ))}
          </Bar>
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}