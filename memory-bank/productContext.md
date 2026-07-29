# Contexto del Producto

## Problema que resuelve
El proyecto busca ofrecer una vista ejecutiva clara de salud financiera, permitiendo observar ingresos, egresos, beneficio y margen a partir de una API de métricas.

## Usuario objetivo
- Personas de negocio o equipos técnicos que necesitan visualizar métricas financieras agregadas.
- Entorno educativo para practicar integración frontend-backend, calidad de código y reglas de ingeniería asistida por IA.

## Propuesta de valor
- Dashboard compacto con KPIs y tendencias.
- API con filtros y endpoints analíticos listos para exploración.
- Setup local simple con Docker Compose.

## Alcance funcional actual
- Visualización de KPIs y dos gráficos de tendencia.
- Endpoints para resumen, top categorías, comparación temporal y alertas.
- Segmentación de datos B2B/B2C.

## Supuestos de producto en la implementación actual
- Los datos provienen de generación mock determinística (no de fuente real persistente).
- El frontend parte de `/api/metrics` para construir la experiencia principal.
- El dashboard está orientado a análisis de alto nivel más que a auditoría transaccional.

## Restricciones actuales
- Sin autenticación/autorización.
- Sin gestión de multi-tenant ni control granular de acceso.
- Sin persistencia de datos históricos reales.

## Evidencia verificable
- Objetivo general y ejecución local: `README.md`, `README.es.md`
- Carga de datos y render del dashboard: `frontend/src/App.tsx`
- Definiciones y endpoints financieros: `backend/app/routes.py`
