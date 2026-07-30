# SPEC 1 - Filtro de rango de fechas en el dashboard principal

## Goal
Permitir que el equipo de finanzas filtre todo el dashboard por un rango de fechas opcional (inicio y fin), usando el formato YYYY-MM-DD, sin perder la posibilidad de ver el dataset completo cuando no hay filtros.

## Scope
- Agregar dos inputs de fecha en la parte superior del dashboard principal:
  - Fecha de inicio
  - Fecha de fin
- Mostrar cerca de los inputs el rango de fechas disponible en datos reales:
  - min_date y max_date del endpoint de facetas.
- Aplicar el filtro de fechas a toda la data que ya se muestra en la pagina (KPIs y ambos graficos).
- Usar estos endpoints:
  - GET /api/metrics/facets para obtener rango valido de fechas.
  - GET /api/metrics extendido con query params start_date y end_date.

## Constraints
- Formato de fecha obligatorio para API: YYYY-MM-DD.
- Nombres de parametros exactos en API:
  - start_date (opcional)
  - end_date (opcional)
- Comportamiento real de API en /api/metrics:
  - Si ambos parametros estan vacios, devuelve todo el dataset.
  - Si solo uno existe, filtra solo por ese limite.
  - Si start_date > end_date, la API responde 200 con lista vacia ([]), no 422.
  - Si el formato de fecha es invalido, la API responde 422.
- El componente no debe enviar fechas con formato distinto.
- La UI debe evitar solicitudes inconsistentes cuando start_date > end_date mostrando validacion local clara.
- El texto del rango valido debe salir de facetas (no hardcode).

## Acceptance criteria
1. Al cargar el dashboard, se consulta GET /api/metrics/facets y se muestra el rango disponible con min_date y max_date.
2. Al cargar inicialmente con inputs vacios, GET /api/metrics se llama sin start_date ni end_date.
3. Si el usuario define solo fecha de inicio, la llamada incluye solo start_date.
4. Si el usuario define solo fecha de fin, la llamada incluye solo end_date.
5. Si el usuario define ambas fechas validas, la llamada incluye start_date y end_date y toda la vista se recalcula con esa respuesta.
6. Si el usuario limpia ambos inputs, el dashboard vuelve a estado de datos completos (sin filtros de fecha).
7. Si start_date > end_date, se muestra mensaje de validacion local y no se dispara llamada hasta corregir.
8. Si la API responde 422 por fecha invalida (caso manual o edge), la UI muestra estado de error legible y no rompe el render.

## Context
### Contrato real de GET /api/metrics/facets (200)
```json
{
  "operation_types": ["income", "outcome"],
  "business_types": ["B2B", "B2C"],
  "categories": ["administrative", "operational", "others", "sales", "suppliers"],
  "min_date": "2025-07-04",
  "max_date": "2026-06-27"
}
```

### Contrato real de GET /api/metrics (200)
```json
[
  {
    "create_date": "2025-07-04",
    "amount": 2335.12,
    "operation_type": "income",
    "category": "sales",
    "business_type": "B2B"
  }
]
```

### Error real de validacion de fecha (422)
```json
{
  "detail": [
    {
      "type": "date_from_datetime_parsing",
      "loc": ["query", "start_date"],
      "msg": "Input should be a valid date or datetime, input is too short",
      "input": "foo"
    }
  ]
}
```
