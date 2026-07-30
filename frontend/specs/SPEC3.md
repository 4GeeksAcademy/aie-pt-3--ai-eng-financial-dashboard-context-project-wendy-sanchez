# SPEC 3 - Vista de comparativa B2B vs B2C

## Goal
Crear una vista dedicada para comparar ingresos entre B2B y B2C, con tablas paralelas de top categorias y un gráfico único de comparación de totales por grupo, filtrable por rango de fechas.

## Scope
- Crear una nueva página/vista de comparativa dentro del dashboard.
- Incluir filtro por rango de fechas (YYYY-MM-DD) con start_date y end_date opcionales.
- Cargar categorías y metadatos base desde:
  - GET /api/metrics/facets
- Cargar datos de ingresos por grupo desde:
  - GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2B
  - GET /api/metrics/categories/top?operation_type=income&limit=5&business_type=B2C
- Aplicar start_date y end_date a ambas llamadas de top categorias cuando el filtro este activo.
- Renderizar dos secciones en paralelo:
  - Seccion B2B: tabla top categorias.
  - Seccion B2C: tabla top categorias.
- Cada tabla muestra:
  - Categoría
  - Total ingresos
  - Porcentaje sobre total del grupo
- Bajo ambas tablas, renderizar un gráfico comparativo único B2B vs B2C con total de ingresos por grupo.

## Constraints
- Parámetros reales de /api/metrics/categories/top:
  - operation_type: income|outcome (default outcome).
  - limit: integer 1..20 (default 5).
  - start_date: date opcional.
  - end_date: date opcional.
  - business_type: B2B|B2C opcional.
- Para esta funcionalidad:
  - operation_type es fijo en income.
  - limit es fijo en 5.
  - business_type se fuerza por seccion (B2B o B2C).
- La respuesta de top categorias no incluye porcentaje; el porcentaje se calcula en frontend:
  - porcentaje_fila = total_amount_fila / suma_total_amount_del_grupo * 100
- El total de ingresos para el gráfico comparativo se define como:
  - suma de total_amount de la respuesta de cada grupo (top con limit=5).
- El endpoint puede devolver menos de 5 filas para un grupo en un rango dado; la tabla debe soportarlo sin error.
- Las categorías disponibles deben tomar como catálogo base facets.categories.
- Si una sección no tiene filas, debe mostrar estado vacío explícito para ese grupo.

## Acceptance criteria
1. Al abrir la vista, se consulta /api/metrics/facets y luego dos llamadas paralelas a /api/metrics/categories/top (B2B y B2C) con operation_type=income&limit=5.
2. Si no hay filtro de fechas, no se envian start_date ni end_date.
3. Si hay filtro activo, ambas llamadas incluyen exactamente los mismos start_date/end_date.
4. Cada tabla muestra maximo 5 filas por grupo con categoria y total_amount de API.
5. El porcentaje de cada fila se calcula sobre el total del propio grupo y suma aproximadamente 100% cuando hay filas.
6. El gráfico inferior compara total ingresos B2B vs B2C usando la suma de total_amount de cada grupo.
7. Si limit inválido o parámetro inválido genera 422, la vista muestra error legible.
8. Si un grupo no tiene datos para el rango, su tabla muestra estado vacío y el gráfico sigue renderizando con 0 para ese grupo.

## Context
### Contrato real de GET /api/metrics/categories/top (200)
```json
[
  {
    "category": "sales",
    "operation_type": "income",
    "total_amount": 557903.97
  },
  {
    "category": "others",
    "operation_type": "income",
    "total_amount": 57636.75
  }
]
```

### Ejemplo real B2C (200)
```json
[
  {
    "category": "sales",
    "operation_type": "income",
    "total_amount": 574193.41
  },
  {
    "category": "others",
    "operation_type": "income",
    "total_amount": 68412.74
  }
]
```

### Validacion real de limit fuera de rango (422)
```json
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": ["query", "limit"],
      "msg": "Input should be less than or equal to 20",
      "input": "25",
      "ctx": { "le": 20 }
    }
  ]
}
```

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
