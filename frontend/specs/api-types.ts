/**
 * Fecha en formato ISO corto esperado por la API.
 *
 * Formato valido: YYYY-MM-DD (por ejemplo: "2026-07-30").
 */
export type ISODateString = `${number}-${number}-${number}`;

/**
 * Tipo de operacion financiera segun contrato de la API.
 *
 * Valores validos: "income" | "outcome".
 */
export type OperationType = "income" | "outcome";

/**
 * Tipo de linea de negocio segun contrato de la API.
 *
 * Valores validos: "B2B" | "B2C".
 */
export type BusinessType = "B2B" | "B2C";

/**
 * Categoria financiera segun contrato de la API.
 *
 * Valores validos:
 * - "suppliers"
 * - "sales"
 * - "operational"
 * - "administrative"
 * - "others"
 */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Respuesta de GET /api/metrics/facets.
 *
 * Se usa para:
 * - Mostrar rango de fechas valido en dashboard principal.
 * - Obtener catalogos base para la vista comparativa B2B vs B2C.
 */
export interface FacetsResponse {
  /**
   * Tipos de operacion disponibles en el dataset.
   *
   * Valores posibles por item: "income" | "outcome".
   */
  operation_types: OperationType[];

  /**
   * Lineas de negocio disponibles en el dataset.
   *
   * Valores posibles por item: "B2B" | "B2C".
   */
  business_types: BusinessType[];

  /**
   * Categorias disponibles en el dataset.
   */
  categories: Category[];

  /**
   * Fecha minima disponible en el dataset.
   *
   * Formato: YYYY-MM-DD.
   */
  min_date: ISODateString;

  /**
   * Fecha maxima disponible en el dataset.
   *
   * Formato: YYYY-MM-DD.
   */
  max_date: ISODateString;
}

/**
 * Fila de alerta de anomalia retornada por GET /api/metrics/alerts.
 */
export interface AlertEntry {
  /**
   * Periodo agregado de la alerta.
   *
   * Formato depende de group_by:
   * - day: YYYY-MM-DD
   * - week: YYYY-Www
   * - month: YYYY-MM
   */
  period: string;

  /**
   * Total de egresos (outcome) registrado en el periodo.
   */
  outcome_total: number;

  /**
   * Promedio historico usado como baseline para comparar el periodo.
   */
  baseline_average: number;

  /**
   * Ratio de incremento contra baseline.
   *
   * Ejemplo: 0.3585 representa 35.85%.
   */
  increase_ratio: number;
}

/**
 * Respuesta de GET /api/metrics/alerts.
 */
export type AlertsResponse = AlertEntry[];

/**
 * Fila de categoria agregada retornada por GET /api/metrics/categories/top.
 */
export interface CategoryEntry {
  /**
   * Nombre de la categoria.
   */
  category: Category;

  /**
   * Tipo de operacion sobre el que se agrego el total.
   *
   * Valores validos: "income" | "outcome".
   */
  operation_type: OperationType;

  /**
   * Total monetario acumulado para la categoria.
   */
  total_amount: number;
}

/**
 * Respuesta de GET /api/metrics/categories/top.
 */
export type TopCategoriesResponse = CategoryEntry[];
