# SPEC 2 - Tabla de alertas de anomalias en el dashboard principal

## Goal
Agregar una tabla de alertas bajo los graficos para destacar periodos con subidas de outcome por encima de un umbral configurable, respetando el rango de fechas activo del dashboard.

## Scope
- Agregar un input numerico para configurar threshold (ratio):
  - valor por defecto: 0.3
  - controlado por usuario antes de refrescar tabla
- Agregar una tabla bajo los graficos con 4 columnas:
  - Periodo
  - Outcome registrado
  - Baseline average
  - Incremento porcentual
- Mostrar estado vacío explícito cuando no existan alertas.
- Consumir endpoint:
  - GET /api/metrics/alerts?threshold=<ratio>
- Integrar filtros de fecha de la funcionalidad 1 en la misma consulta:
  - start_date y end_date opcionales.

## Constraints
- Parámetros reales soportados por /api/metrics/alerts:
  - threshold: number, default 0.3, minimo ge=0.
  - group_by: enum day|week|month, default month.
  - start_date: date opcional.
  - end_date: date opcional.
  - business_type: B2B|B2C opcional.
- Para esta funcionalidad, group_by queda fijo en month para mantener coherencia con el dashboard mensual actual.
- Restricción funcional de UI solicitada por negocio:
  - permitir editar threshold solo entre 0.01 y 1.0.
  - si el usuario intenta salir del rango, bloquear aplicación y mostrar mensaje.
- El endpoint puede aceptar threshold > 1 y responder 200 con []; esta UI no debe enviar ese valor por restricción de producto.
- La columna de baseline debe usar exactamente baseline_average devuelto por API.
- La API actual calcula baseline con promedio histórico de periodos previos disponibles (no promedio movil fijo de 3 periodos). No recalcular en frontend.
- Si la API devuelve [], la tabla no desaparece: debe renderizar estado vacío explícito.

## Acceptance criteria
1. Con threshold por defecto (0.3) y sin fechas, se consulta /api/metrics/alerts?threshold=0.3&group_by=month.
2. Si hay fechas activas en funcionalidad 1, la consulta de alertas incluye start_date y/o end_date.
3. La tabla muestra cada fila mapeando:
   - period -> columna Periodo
   - outcome_total -> Outcome registrado
   - baseline_average -> Baseline average
   - increase_ratio -> Incremento porcentual (ratio * 100)
4. Si no hay resultados, se muestra mensaje explicito (ejemplo: "No se detectaron anomalias para el umbral actual").
5. Si threshold < 0.01 o > 1.0, la UI muestra validacion local y no envia request.
6. Si backend responde 422 (ejemplo threshold negativo por manipulacion externa), la UI muestra error legible.
7. Cambiar threshold vuelve a consultar alertas y actualiza solo esta seccion sin romper KPIs/graficos.

## Context
### Contrato real de GET /api/metrics/alerts (200)
```json
[
  {
    "period": "2025-08",
    "outcome_total": 82189.37,
    "baseline_average": 60499.53,
    "increase_ratio": 0.3585
  }
]
```

### Validacion real de threshold negativo (422)
```json
{
  "detail": [
    {
      "type": "greater_than_equal",
      "loc": ["query", "threshold"],
      "msg": "Input should be greater than or equal to 0",
      "input": "-0.1",
      "ctx": { "ge": 0.0 }
    }
  ]
}
```

### Validacion real de group_by invalido (422)
```json
{
  "detail": [
    {
      "type": "literal_error",
      "loc": ["query", "group_by"],
      "msg": "Input should be 'day', 'week' or 'month'",
      "input": "year"
    }
  ]
}
```
