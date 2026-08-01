# Desglose de componentes

## Funcionalidad 1: Filtro de rango de fechas en dashboard principal

### DateRangeFilterBar
- Responsabilidad: Renderizar los inputs de fecha inicio/fin y el texto de referencia con min_date y max_date.
- Entradas:
  - valor actual de start_date/end_date.
  - rango valido desde facetas (min_date, max_date).
  - estados de validacion local.
- Salidas:
  - eventos onStartDateChange y onEndDateChange.
  - accion de limpiar filtros.
- Estados UI:
  - normal.
  - validacion local (start_date > end_date).

### DashboardDataContainer
- Responsabilidad: Orquestar fetch de datos filtrados para KPIs y graficos.
- Entradas:
  - DateRangeFilter.
- Salidas:
  - datos listos para KPIs y graficos.
  - estados loading/error/empty.

### DateRangeReference
- Responsabilidad: Mostrar texto de ayuda con rango de fechas disponible del dataset.
- Entradas:
  - FacetsResponse.min_date y FacetsResponse.max_date.
- Estados UI:
  - loading de facetas.
  - error de facetas.

## Funcionalidad 2: Tabla de alertas de anomalias

### AlertsPanel
- Responsabilidad: Contenedor de la seccion de alertas bajo los graficos.
- Entradas:
  - DateRangeFilter compartido.
- Salidas:
  - render de input de umbral y tabla.
  - estados loading/error/empty.

### ThresholdInput
- Responsabilidad: Permitir configurar threshold con validacion local de negocio.
- Entradas:
  - valor threshold actual.
  - limites de UI (0.01 a 1.0).
- Salidas:
  - evento onThresholdChange.
  - estado invalido cuando sale de rango.

### AlertsTable
- Responsabilidad: Renderizar columnas periodo, outcome_total, baseline_average e increase_ratio.
- Entradas:
  - AlertsResponse.
- Estados UI:
  - filas con datos.
  - estado vacio explicito si AlertsResponse es [].
  - error explicito si API responde 422 u otro error.

## Funcionalidad 3: Vista comparativa B2B vs B2C

### BusinessComparisonPage
- Responsabilidad: Vista dedicada para comparativa de ingresos por linea de negocio.
- Entradas:
  - DateRangeFilter.
- Salidas:
  - dos tablas top categorias (B2B y B2C).
  - grafico comparativo total B2B vs B2C.

### TopCategoriesSection
- Responsabilidad: Seccion reutilizable para cada grupo (B2B o B2C).
- Entradas:
  - etiqueta de grupo (B2B/B2C).
  - TopCategoriesResponse de ese grupo.
- Salidas:
  - tabla con categoria, total_amount y porcentaje sobre total del grupo.
- Estados UI:
  - loading por grupo.
  - error por grupo.
  - vacio explicito por grupo.

### TopCategoriesTable
- Responsabilidad: Mostrar hasta 5 categorias y calcular porcentaje relativo del grupo.
- Entradas:
  - CategoryEntry[].
- Reglas:
  - porcentaje = total_amount_fila / suma_total_amount_grupo * 100.

### B2BvsB2CTotalsChart
- Responsabilidad: Visualizar comparacion del total de ingresos entre ambos grupos.
- Entradas:
  - totalIncomeB2B (suma de top categories B2B).
  - totalIncomeB2C (suma de top categories B2C).
- Estados UI:
  - render normal con ambos totales.
  - si un grupo esta vacio, mostrar total 0 para ese grupo sin ocultar el grafico.
