# Estado Actual

## Funcionalidades implementadas
### API backend
- Endpoint de salud (`/health`) implementado.
- Endpoint de listado de métricas con filtros por fecha/categoría/tipo de operación.
- Endpoint de facetas con tipos de operación, tipo de negocio, categorías y rango de fechas.
- Endpoint de resumen con modos `group_by`: `day`, `week`, `month`.
- Endpoint de top categorías con totales ordenables y validación de `limit`.
- Endpoint de comparación entre periodo actual y anterior (`delta_abs`, `delta_pct`).
- Endpoint de alertas por incremento de egresos sobre baseline histórico.
- Endpoints segmentados de métricas para B2B y B2C.

### Dashboard frontend
- Consume datos desde `/api/metrics` y calcula KPIs en cliente.
- Muestra tarjetas KPI (ingresos, egresos, beneficio y margen).
- Muestra dos paneles de gráficos: tendencia ingreso/egreso y tendencia de margen.
- Maneja estado de carga con skeletons.
- Maneja estado vacío de gráficos y estado de error de API.

### Cobertura de pruebas existente
- Pruebas backend de rutas cubren endpoints principales y comportamiento de filtros.
- Pruebas frontend cubren utilidades financieras y formateadores.

## Gaps y riesgos conocidos
### Arquitectura y mantenibilidad
- El archivo de rutas backend mezcla handlers HTTP, modelos de esquema y lógica de negocio.
- La generación mock y el cómputo de dominio están acoplados a la capa HTTP.

### Seguridad y configuración
- CORS es permisivo actualmente (`allow_origins=["*"]` con credenciales habilitadas).
- No hay estrategia explícita en código para configurar CORS por entorno.

### Realismo de producto/datos
- La fuente de datos es sintética; no existe persistencia ni integración externa.
- La etiqueta de periodo en frontend es fija y puede desalinearse del rango real filtrado.

### Profundidad de testing
- El frontend no tiene pruebas de componentes para estados del dashboard.
- Las pruebas backend se enfocan en casos felices y tienen menor matriz negativa explícita.

### Reproducibilidad operativa
- `backend/requirements.txt` no está fijado por versión, elevando riesgo de drift entre entornos.

## Siguientes prioridades sugeridas
1. Extraer capa de dominio/servicios del backend y dejar handlers delgados.
2. Introducir configuración por entorno para CORS y runtime.
3. Ampliar suite de pruebas:
   - Casos negativos backend (filtros o rangos inválidos).
   - Pruebas de componentes frontend para loading/error/empty y render básico de gráficos.
4. Introducir fuente configurable para el periodo mostrado (derivada de datos o parámetros).
5. Definir hoja de ruta para integración con datos reales (BD o servicio externo) y versionado de contratos.
6. Fijar versiones de dependencias backend o adoptar estrategia de lock para builds determinísticos.

## Mapa de evidencia
- API y lógica backend: `backend/app/routes.py`
- Aplicación backend y configuración CORS: `backend/app/main.py`
- Pruebas backend: `backend/tests/test_routes.py`
- Comportamiento de app frontend: `frontend/src/App.tsx`
- Componentes de dashboard frontend: `frontend/src/components/dashboard/*.tsx`
- Pruebas de utilidades frontend: `frontend/src/lib/financial-utils.test.ts`
- Definiciones de dependencias e infraestructura: `frontend/package.json`, `backend/requirements.txt`, `docker-compose.yml`
