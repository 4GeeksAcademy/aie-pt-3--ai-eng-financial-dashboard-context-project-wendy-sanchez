# Frontend Specs: Tipos y contratos API

Este directorio documenta los tipos y contratos necesarios para implementar tres funcionalidades del dashboard sin desviarse de la API real publicada en /docs.

## Archivos
- api-types.ts: tipos de respuesta de API para facetas, alertas y top categorias.
- param-types.ts: tipos de parametros de consulta por funcionalidad.
- SPEC1.md, SPEC2.md, SPEC3.md: especificaciones funcionales detalladas.
- components.md: desglose de componentes sugerido por funcionalidad.

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### Endpoints consumidos
- GET /api/metrics/facets
- GET /api/metrics

### Tipos TypeScript usados
- Respuesta:
  - FacetsResponse
- Parametros:
  - DateRangeFilter (start_date, end_date) para GET /api/metrics

### Parametros validos y restricciones
- start_date (opcional): YYYY-MM-DD.
- end_date (opcional): YYYY-MM-DD.
- Comportamiento verificado:
  - Fechas invalidas devuelven 422.
  - start_date > end_date devuelve 200 con lista vacia en /api/metrics.

### Edge cases y comportamiento esperado de UI
1. start_date > end_date:
   - UI muestra validacion local clara.
   - UI no dispara request hasta corregir.
2. Fecha con formato invalido (ejemplo manual "foo"):
   - API responde 422.
   - UI muestra mensaje de error legible y mantiene layout.
3. Ambos filtros vacios:
   - UI consulta /api/metrics sin start_date/end_date.
   - UI muestra dataset completo.

## Funcionalidad 2: Tabla de alertas de anomalias

### Endpoints consumidos
- GET /api/metrics/alerts

### Tipos TypeScript usados
- Respuesta:
  - AlertEntry
  - AlertsResponse
- Parametros:
  - AlertsParams (threshold + DateRangeFilter)

### Parametros validos y restricciones
- threshold:
  - API: number, default 0.3, minimo >= 0.
  - UI de producto: permitir solo 0.01 a 1.0.
- start_date (opcional): YYYY-MM-DD.
- end_date (opcional): YYYY-MM-DD.
- group_by existe en API con valores day|week|month, pero para esta funcionalidad queda fijo en month.

### Edge cases y comportamiento esperado de UI
1. No hay alertas para el umbral actual:
   - API responde [].
   - UI muestra estado vacio explicito (no desaparece la tabla/seccion).
2. threshold fuera de rango de UI (<0.01 o >1.0):
   - UI bloquea envio y muestra validacion local.
3. threshold negativo por manipulacion externa:
   - API responde 422.
   - UI muestra error legible sin romper el dashboard.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### Endpoints consumidos
- GET /api/metrics/facets
- GET /api/metrics/categories/top

### Tipos TypeScript usados
- Respuesta:
  - FacetsResponse
  - CategoryEntry
  - TopCategoriesResponse
- Parametros:
  - DateRangeFilter
  - TopCategoriesParams (operation_type, limit + DateRangeFilter)

### Parametros validos y restricciones
- operation_type:
  - Valores API: income | outcome.
  - En esta funcionalidad: fijo en income.
- limit:
  - API: entero entre 1 y 20 (default 5).
  - En esta funcionalidad: fijo en 5.
- start_date (opcional): YYYY-MM-DD.
- end_date (opcional): YYYY-MM-DD.
- business_type:
  - API soporta B2B | B2C.
  - Se usa internamente para disparar dos consultas separadas (una por grupo).

### Edge cases y comportamiento esperado de UI
1. Un grupo devuelve menos de 5 categorias o []:
   - Su tabla muestra estado vacio explicito si aplica.
   - El grafico comparativo mantiene la serie con total 0 para el grupo vacio.
2. limit invalido (ejemplo 25):
   - API responde 422.
   - UI muestra error legible en la vista comparativa.
3. Rango de fechas muy restrictivo:
   - Puede reducir categorias y totales de ambos grupos.
   - UI mantiene tablas y grafico consistentes con datos devueltos.

## Mapa rapido de tipos
- api-types.ts
  - FacetsResponse
  - AlertEntry
  - AlertsResponse
  - CategoryEntry
  - TopCategoriesResponse
- param-types.ts
  - DateRangeFilter
  - AlertsParams
  - TopCategoriesParams
