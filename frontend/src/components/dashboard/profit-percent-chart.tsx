import { useId } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { type MonthlyDataPoint } from '@/lib/financial-types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'

interface ProfitPercentChartProps {
  data: MonthlyDataPoint[]
  loading?: boolean
}

interface TooltipPayload {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const value = payload[0]?.value ?? 0
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: 'var(--chart-profit)' }}
        />
        <span className="text-muted-foreground">Profit margin:</span>
        <span className="font-medium text-foreground ml-auto pl-4">{value.toFixed(1)}%</span>
      </div>
    </div>
  )
}

function buildChartSummary(data: MonthlyDataPoint[]) {
  if (data.length === 0) {
    return 'No monthly profit margin data is available.'
  }

  const highestMarginMonth = data.reduce((highest, current) =>
    current.profitPercent > highest.profitPercent ? current : highest,
  )
  const lowestMarginMonth = data.reduce((lowest, current) =>
    current.profitPercent < lowest.profitPercent ? current : lowest,
  )

  return `Monthly line chart. Highest profit margin was ${highestMarginMonth.profitPercent.toFixed(1)} percent in ${highestMarginMonth.month}. Lowest profit margin was ${lowestMarginMonth.profitPercent.toFixed(1)} percent in ${lowestMarginMonth.month}.`
}

export function ProfitPercentChart({ data, loading }: ProfitPercentChartProps) {
  const titleId = useId()
  const descriptionId = useId()
  const summaryId = useId()

  if (loading) {
    return (
      <Card className="border-border/60" aria-hidden="true">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3 w-64 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  const hasData = data.some((d) => d.profitPercent !== 0)
  const summary = buildChartSummary(data)

  return (
    <Card
      className="border-border/60"
      role="figure"
      aria-labelledby={titleId}
      aria-describedby={`${descriptionId} ${summaryId}`}
    >
      <CardHeader className="pb-4">
        <CardTitle id={titleId} className="text-base font-semibold">Profit Margin %</CardTitle>
        <CardDescription id={descriptionId}>Monthly profit as a percentage of total income</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div role="status" className="flex h-[280px] items-center justify-center text-muted-foreground text-sm">
            No data available to display
          </div>
        ) : (
          <>
            <p id={summaryId} className="sr-only">
              {summary}
            </p>
            <div role="img" aria-labelledby={`${titleId} ${descriptionId} ${summaryId}`}>
              <div aria-hidden="true">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.6} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v.toFixed(0)}%`}
                      width={40}
                      domain={['auto', 'auto']}
                    />
                    <ReferenceLine y={0} stroke="var(--color-border)" strokeDasharray="4 4" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="profitPercent"
                      name="profitPercent"
                      stroke="var(--chart-profit)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'var(--chart-profit)', strokeWidth: 0 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
