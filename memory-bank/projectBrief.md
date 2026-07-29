# Visión General del Producto

## Resumen del producto
Este repositorio implementa un dashboard de métricas financieras compuesto por:
- Un frontend en React + TypeScript que muestra KPIs ejecutivos y gráficos de tendencia.
- Un backend en FastAPI que expone endpoints de métricas financieras.
- Orquestación con Docker Compose para desarrollo local de frontend y backend.

## Objetivos del producto inferidos del código
- Presentar una vista ejecutiva compacta de ingresos, egresos, beneficio y margen.
- Permitir exploración de métricas por filtros de fecha, tipo de operación, categoría y tipo de negocio.
- Ofrecer endpoints analíticos más allá de registros crudos (resumen, top categorías, comparación, alertas).
- Mantener un setup local simple para flujos educativos e iterativos.

## Capacidades principales para usuario
### Interfaz del dashboard
- Encabezado con periodo de reporte e identidad del tablero.
- Fila de KPIs: ingreso total, egreso total, beneficio y margen de beneficio.
- Gráfico de líneas de ingresos vs egresos por mes.
- Gráfico de líneas del margen de beneficio mensual.
- Skeletons de carga y estado vacío en componentes de gráficos.
- Mensaje de error cuando no se puede cargar información del backend.

### Capacidades de API
- Endpoint de salud.
- Endpoint de métricas con filtros.
- Endpoint de facetas (filtros disponibles y rango de fechas).
- Endpoint de resumen agrupable por día/semana/mes.
- Endpoint de top categorías con límite y tipo de operación.
- Endpoint de comparación de periodos con delta absoluto y porcentual.
- Endpoint de alertas por umbral sobre baseline histórico de egresos.
- Endpoints segmentados para movimientos B2B y B2C.

## Modelo de datos y comportamiento
- Los registros financieros incluyen fecha, monto, tipo de operación, categoría y tipo de negocio.
- El backend usa generación mock determinística (`seed=42`) para producir un dataset anual sintético.
- El frontend calcula KPIs y series mensuales antes de renderizar.

## Modelo de ejecución
- El frontend consume `/api/metrics` usando `VITE_API_BASE_URL` con fallback a origen vacío.
- El backend se ejecuta con CORS permisivo en la implementación actual.
- Docker Compose publica frontend en `5173` y backend en `8000`.

## Mapa de evidencia
- Descripción del producto y flujo de arranque: `README.md`
- Entrada del frontend y estados de fetch/UI: `frontend/src/App.tsx`
- KPIs y gráficos: `frontend/src/components/dashboard/kpi-row.tsx`, `frontend/src/components/dashboard/income-outcome-chart.tsx`, `frontend/src/components/dashboard/profit-percent-chart.tsx`, `frontend/src/components/dashboard/dashboard-header.tsx`
- Configuración de aplicación backend: `backend/app/main.py`
- Rutas y comportamiento de métricas: `backend/app/routes.py`
- Orquestación local: `docker-compose.yml`
