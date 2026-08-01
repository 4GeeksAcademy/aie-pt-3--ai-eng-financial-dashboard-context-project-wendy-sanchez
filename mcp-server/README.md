# Financial Dashboard MCP Server

Servidor MCP en TypeScript para consultar la API financiera del proyecto por stdio.

## Requisitos

- Node.js 20+
- Backend de FastAPI disponible en `http://127.0.0.1:8000` o en la URL definida por `FINANCIAL_API_BASE_URL`

## Instalacion

```bash
cd mcp-server
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Ejecucion

```bash
FINANCIAL_API_BASE_URL=http://127.0.0.1:8000 npm start
```

## MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## Tools disponibles

- `get_metrics_summary`: resume ingresos, egresos y neto por periodo.
- `get_top_categories`: devuelve categorias mas relevantes para ingresos o egresos.
- `get_metrics_alerts`: devuelve alertas por crecimientos anormales del gasto.

## Variables de entorno

- `FINANCIAL_API_BASE_URL`: URL base de la API. Valor por defecto: `http://127.0.0.1:8000`
