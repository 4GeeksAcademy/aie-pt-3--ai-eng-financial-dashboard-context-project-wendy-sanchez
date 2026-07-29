# Patrones del Sistema

## Patrón de arquitectura general
- Arquitectura de dos capas en runtime local:
  - Frontend SPA en React/Vite.
  - Backend API REST en FastAPI.
- Orquestación local mediante Docker Compose.

## Patrones backend observados
### Router + lógica de dominio en un mismo módulo
- `backend/app/routes.py` concentra:
  - Modelos Pydantic.
  - Funciones de cálculo y agregación.
  - Endpoints HTTP.

### Pipeline de procesamiento de métricas
- Flujo recurrente en endpoints:
  1. Generar o cargar movimientos.
  2. Filtrar por parámetros de consulta.
  3. Agregar o transformar.
  4. Devolver respuesta tipada (`response_model`).

### Tipado fuerte de contratos
- Uso de `Literal` y modelos Pydantic para tipos de operación, categoría, negocio y payloads de salida.

## Patrones frontend observados
### Separación cálculo vs presentación
- Utilidades financieras en `frontend/src/lib/financial-utils.ts`.
- Componentes de visualización en `frontend/src/components/dashboard/*.tsx`.

### Patrón de estados de carga/resultado
- En `frontend/src/App.tsx` se maneja `loading`, `error` y estado de datos para render condicional.
- Componentes de gráfico usan skeleton y fallback de estado vacío.

### Composición de UI reusable
- Tarjetas KPI y gráficos como componentes desacoplados de la capa de fetch.

## Patrones de pruebas
- Backend: pruebas funcionales de rutas y filtros con `TestClient`.
- Frontend: pruebas unitarias de utilidades puras con Vitest.

## Implicaciones de diseño
- Patrón actual favorece velocidad de iteración para entorno educativo.
- Para escalabilidad, conviene evolucionar a capas más separadas en backend (router/servicio/datos).

## Evidencia verificable
- Backend app y CORS: `backend/app/main.py`
- Backend rutas, modelos y lógica: `backend/app/routes.py`
- Frontend app y estado de carga/error: `frontend/src/App.tsx`
- Componentes dashboard: `frontend/src/components/dashboard/*.tsx`
- Pruebas backend y frontend: `backend/tests/test_routes.py`, `frontend/src/lib/financial-utils.test.ts`
- Orquestación local: `docker-compose.yml`
