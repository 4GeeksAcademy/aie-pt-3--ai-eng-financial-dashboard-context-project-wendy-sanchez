import { McpServer } from '@modelcontextprotocol/server'
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio'
import { z } from 'zod'

const apiBaseUrl = process.env.FINANCIAL_API_BASE_URL ?? 'http://127.0.0.1:8000'

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD date format')

const summaryInputSchema = z.object({
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  category: z
    .enum(['suppliers', 'sales', 'operational', 'administrative', 'others'])
    .optional(),
  operationType: z.enum(['income', 'outcome']).optional(),
  businessType: z.enum(['B2B', 'B2C']).optional(),
})

const topCategoriesInputSchema = z.object({
  operationType: z.enum(['income', 'outcome']).default('outcome'),
  limit: z.number().int().min(1).max(20).default(5),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  businessType: z.enum(['B2B', 'B2C']).optional(),
})

const alertsInputSchema = z.object({
  threshold: z.number().min(0).default(0.3),
  groupBy: z.enum(['day', 'week', 'month']).default('month'),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  businessType: z.enum(['B2B', 'B2C']).optional(),
})

type QueryParams = Record<string, string | number | undefined>

function buildUrl(path: string, query: QueryParams = {}) {
  const url = new URL(path, apiBaseUrl)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

async function fetchJson<T>(path: string, query?: QueryParams): Promise<T> {
  const url = buildUrl(path, query)

  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error'
    throw new Error(`Could not reach financial API at ${url.origin}: ${message}`)
  }

  if (!response.ok) {
    throw new Error(`Financial API request failed with status ${response.status} for ${url.pathname}`)
  }

  return (await response.json()) as T
}

function formatSummaryText(data: Array<{ period: string; income: number; outcome: number; net: number }>) {
  if (data.length === 0) {
    return 'No summary records were returned for the selected filters.'
  }

  const first = data[0]
  const last = data[data.length - 1]
  return [
    `Returned ${data.length} summary rows from ${first.period} to ${last.period}.`,
    `Latest period ${last.period}: income ${last.income.toFixed(2)}, outcome ${last.outcome.toFixed(2)}, net ${last.net.toFixed(2)}.`,
  ].join(' ')
}

function formatTopCategoriesText(
  data: Array<{ category: string; operation_type: string; total_amount: number }>,
) {
  if (data.length === 0) {
    return 'No categories were returned for the selected filters.'
  }

  const top = data[0]
  return `Returned ${data.length} categories. Top category is ${top.category} for ${top.operation_type} with total ${top.total_amount.toFixed(2)}.`
}

function formatAlertsText(
  data: Array<{ period: string; outcome_total: number; baseline_average: number; increase_ratio: number }>,
) {
  if (data.length === 0) {
    return 'No anomaly alerts were detected for the selected filters.'
  }

  const first = data[0]
  return `Returned ${data.length} alerts. First alert: ${first.period} with outcome ${first.outcome_total.toFixed(2)} against baseline ${first.baseline_average.toFixed(2)}.`
}

const server = new McpServer({
  name: 'financial-dashboard-mcp-server',
  version: '0.1.0',
})

server.registerTool(
  'get_metrics_summary',
  {
    title: 'Get financial metrics summary',
    description: 'Fetches aggregated income, outcome and net values from the dashboard backend.',
    inputSchema: summaryInputSchema,
  },
  async (input) => {
    try {
      const data = await fetchJson<Array<{ period: string; income: number; outcome: number; net: number }>>(
        '/api/metrics/summary',
        {
          group_by: input.groupBy,
          start_date: input.startDate,
          end_date: input.endDate,
          category: input.category,
          operation_type: input.operationType,
          business_type: input.businessType,
        },
      )

      return {
        content: [{ type: 'text', text: formatSummaryText(data) }],
        structuredContent: {
          source: '/api/metrics/summary',
          filters: input,
          data,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        content: [{ type: 'text', text: `Failed to fetch summary: ${message}` }],
        structuredContent: {
          source: '/api/metrics/summary',
          filters: input,
          error: message,
        },
        isError: true,
      }
    }
  },
)

server.registerTool(
  'get_top_categories',
  {
    title: 'Get top categories',
    description: 'Fetches the highest-value categories for income or outcome movements.',
    inputSchema: topCategoriesInputSchema,
  },
  async (input) => {
    try {
      const data = await fetchJson<Array<{ category: string; operation_type: string; total_amount: number }>>(
        '/api/metrics/categories/top',
        {
          operation_type: input.operationType,
          limit: input.limit,
          start_date: input.startDate,
          end_date: input.endDate,
          business_type: input.businessType,
        },
      )

      return {
        content: [{ type: 'text', text: formatTopCategoriesText(data) }],
        structuredContent: {
          source: '/api/metrics/categories/top',
          filters: input,
          data,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        content: [{ type: 'text', text: `Failed to fetch top categories: ${message}` }],
        structuredContent: {
          source: '/api/metrics/categories/top',
          filters: input,
          error: message,
        },
        isError: true,
      }
    }
  },
)

server.registerTool(
  'get_metrics_alerts',
  {
    title: 'Get spending alerts',
    description: 'Fetches anomaly candidates for unusual outcome growth over time.',
    inputSchema: alertsInputSchema,
  },
  async (input) => {
    try {
      const data = await fetchJson<
        Array<{ period: string; outcome_total: number; baseline_average: number; increase_ratio: number }>
      >('/api/metrics/alerts', {
        threshold: input.threshold,
        group_by: input.groupBy,
        start_date: input.startDate,
        end_date: input.endDate,
        business_type: input.businessType,
      })

      return {
        content: [{ type: 'text', text: formatAlertsText(data) }],
        structuredContent: {
          source: '/api/metrics/alerts',
          filters: input,
          data,
        },
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        content: [{ type: 'text', text: `Failed to fetch alerts: ${message}` }],
        structuredContent: {
          source: '/api/metrics/alerts',
          filters: input,
          error: message,
        },
        isError: true,
      }
    }
  },
)

const transport = new StdioServerTransport()

async function main() {
  await server.connect(transport)
}

void main().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error)
  console.error(message)
  process.exit(1)
})

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    process.exit(0)
  })
}