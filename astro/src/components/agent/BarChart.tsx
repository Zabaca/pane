import {
  Bar,
  BarChart as RBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

/**
 * Agent-facing bar chart. Drop into MDX with no imports:
 *
 *   <BarChart
 *     dataKey="month"
 *     series={[{ key: "sessions", label: "Sessions", color: "var(--chart-1)" }]}
 *     data={[{ month: "Jan", sessions: 12 }, { month: "Feb", sessions: 31 }]}
 *   />
 */
export default function BarChart({
  data,
  series,
  dataKey,
  height = 260,
}: {
  data: Array<Record<string, string | number>>
  series: Array<{ key: string; label?: string; color?: string }>
  dataKey: string
  height?: number
}) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      { label: s.label ?? s.key, color: s.color ?? `var(--chart-${(i % 5) + 1})` },
    ]),
  )

  return (
    <ChartContainer config={config} style={{ height }} className="w-full">
      <RBarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey={dataKey} tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={4} />
        ))}
      </RBarChart>
    </ChartContainer>
  )
}
