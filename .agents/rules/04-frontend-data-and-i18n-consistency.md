# Regla 04 - Frontend: datos, estados e i18n consistente

## Nombre
Frontend: datos, estados e i18n consistente

## Alcance
- `frontend/src/App.tsx`
- `frontend/src/components/dashboard/**/*.tsx`
- `frontend/src/lib/financial-utils.ts`

## Razón
El proyecto ya separa lógica financiera de la UI y muestra estados de carga/error. La regla preserva ese patrón y evita hardcodes de local o periodos.

## Regla operativa
1. Mantener separación entre calculos (lib) y componentes de presentación.
2. Toda llamada API debe manejar estado de carga, error y datos vacíos.
3. Evitar literales de locale y periodo en múltiples archivos; si aparecen en 2 o más archivos, centralizar en utilidades o configuración compartida.
4. Mensajes de error deben ser útiles para soporte técnico sin exponer detalles sensibles.

## Criterios verificables
- Componentes de dashboard no deben recalcular agregaciones complejas si ya existen utilidades compartidas.
- Si se agrega nuevo fetch en `App.tsx` o equivalente, incluir manejo explícito de error.
- Nuevos formateos monetarios o de fecha deben reutilizar utilidades comunes.

## Señales de violación
- Uso repetido de `Intl.NumberFormat` o `toLocaleDateString` en múltiples componentes sin helper comun.
- Hardcode de periodos (ejemplo: año fijo) sin relación con data real.

## Como guía tareas reales en este repo
- Si se agrega gráfico trimestral, implementar agregado en `financial-utils.ts` y solo visualizar en componente.
