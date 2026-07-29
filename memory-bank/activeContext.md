# Contexto Activo

## Estado operativo actual
- Frontend y backend se ejecutan por Docker Compose.
- Endpoints validados previamente en esta sesión:
  - Frontend en `http://localhost:5173`.
  - Backend operativo en `http://localhost:8000` (ruta raíz puede devolver 404 por diseño actual).
  - Documentación API en `http://localhost:8000/docs`.
  - Salud backend en `/health` con estado OK.

## Artefactos activos de documentación técnica
- Reglas de trabajo para agentes en `.agents/rules/`.
- Banco de memoria del repositorio en `memory-bank/`.

## Capacidades activas en frontend
- Carga de movimientos desde `/api/metrics`.
- Cálculo local de KPIs y serie mensual.
- Render de KPIs, gráfico ingreso/egreso y gráfico de margen.
- Manejo de loading/error/empty.

## Capacidades activas en backend
- Filtros de métricas por fecha/categoría/tipo de operación.
- Segmentación B2B/B2C.
- Resúmenes temporales, comparación de periodos, top categorías y alertas.
- Contratos tipados con modelos de respuesta.

## Riesgos activos (a vigilar en próximas tareas)
- CORS permisivo para cualquier origen en configuración actual.
- Acoplamiento de lógica de dominio y handlers HTTP en un solo módulo.
- Cobertura de pruebas frontend centrada en utilidades, no en componentes.
- Dependencias backend sin pin de versión.

## Próximas acciones recomendadas (corto plazo)
1. Endurecer configuración CORS por entorno.
2. Separar lógica de negocio del archivo de rutas backend.
3. Agregar pruebas de componentes frontend para estados críticos.
4. Definir estrategia de versionado de dependencias backend.

## Evidencia verificable
- Estado frontend: `frontend/src/App.tsx`
- Componentes dashboard: `frontend/src/components/dashboard/*.tsx`
- Estado backend: `backend/app/main.py`, `backend/app/routes.py`
- Pruebas: `backend/tests/test_routes.py`, `frontend/src/lib/financial-utils.test.ts`
- Infra local: `docker-compose.yml`
