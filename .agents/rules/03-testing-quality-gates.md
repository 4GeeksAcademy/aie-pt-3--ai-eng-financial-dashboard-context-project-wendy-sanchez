# Regla 03 - Puertas mínimas de testing

## Nombre
Puertas mínimas de testing

## Alcance
- `backend/tests/**/*.py`
- `frontend/src/**/*.test.ts*`
- Cambios en endpoints de API, utilidades financieras y componentes de dashboard.

## Razón
El backend tiene buena base de pruebas funcionales, pero el frontend solo prueba utilidades y faltan escenarios negativos de API.

## Regla operativa
1. Todo cambio de endpoint debe agregar o ajustar pruebas para caso feliz y al menos un caso invalido.
2. Toda lógica de cálculo financiero nueva debe tener pruebas unitarias.
3. Todo componente crítico de dashboard debe cubrir estados `loading`, `error` o `empty`.

## Definición de componente crítico en este repo
- Componentes renderizados desde `frontend/src/App.tsx` para KPIs y gráficos.
- Componentes que dependen de datos de API o de utilidades financieras.

## Criterios verificables
- Si cambia un endpoint en `backend/app/routes.py`, debe existir test relacionado en `backend/tests/test_routes.py`.
- Si cambia `frontend/src/lib/financial-utils.ts`, deben actualizarse tests en `frontend/src/lib/financial-utils.test.ts`.
- Si se agrega componente dashboard nuevo, incluir test de render básico y al menos un estado de falta de datos (`empty` o `loading`).

## Señales de violación
- PR con cambios de comportamiento en API sin nuevos asserts.
- Lógica de transformación financiera sin cobertura.

## Como guía tareas reales en este repo
- Si se agrega filtro nuevo `business_type` en otro endpoint, incluir test que confirme filtrado correcto y orden cronológico.
