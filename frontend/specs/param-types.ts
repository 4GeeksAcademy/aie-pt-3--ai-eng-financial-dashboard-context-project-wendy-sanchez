import type { ISODateString, OperationType } from "./api-types";

/**
 * Filtro de rango de fechas compartido entre funcionalidades.
 */
export interface DateRangeFilter {
  /**
   * Fecha de inicio inclusiva del filtro.
   *
   * Opcional. Si no se envia, no se aplica limite inferior.
   * Formato: YYYY-MM-DD.
   */
  start_date?: ISODateString;

  /**
   * Fecha de fin inclusiva del filtro.
   *
   * Opcional. Si no se envia, no se aplica limite superior.
   * Formato: YYYY-MM-DD.
   */
  end_date?: ISODateString;
}

/**
 * Parametros de consulta para la tabla de anomalias.
 *
 * Endpoint: GET /api/metrics/alerts
 */
export interface AlertsParams extends DateRangeFilter {
  /**
   * Umbral minimo de incremento para disparar una alerta.
   *
   * Restriccion de backend: >= 0.
   * Restriccion de producto/UI en esta funcionalidad: 0.01 a 1.0.
   * Valor por defecto de API: 0.3.
   */
  threshold: number;
}

/**
 * Parametros de consulta para top categorias.
 *
 * Endpoint: GET /api/metrics/categories/top
 */
export interface TopCategoriesParams extends DateRangeFilter {
  /**
   * Tipo de operacion a agregar.
   *
   * Valores validos: "income" | "outcome".
   * En la comparativa B2B vs B2C se usa "income".
   */
  operation_type: OperationType;

  /**
   * Numero maximo de categorias a devolver.
   *
   * Restriccion de backend: entero entre 1 y 20.
   * En la comparativa B2B vs B2C se usa 5.
   */
  limit: number;
}
