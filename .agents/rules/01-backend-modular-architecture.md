# Regla 01 - Backend modular por capas ligeras

## Nombre
Backend modular por capas ligeras

## Alcance
- Archivos en `backend/app/**/*.py`
- Tareas que agregan endpoints, cambian lógica de negocio o modelos de datos.

## Razón
El archivo `backend/app/routes.py` concentra rutas, modelos y lógica de negocio. Esta regla evita crecimiento monolitico y facilita pruebas y mantenimiento.

## Regla operativa
1. Los handlers HTTP deben quedarse en el router y delegar la lógica de negocio a funciones de servicio.
2. Los modelos Pydantic deben vivir en un modulo de schemas cuando su uso crece o se comparte entre endpoints.
3. La generación o acceso a datos (mock o real) debe quedar fuera del handler.

## Criterios verificables
- Un endpoint nuevo no debe introducir transformaciones complejas dentro de la función decorada con `@router.get`.
- Si una función en router supera 30 líneas y mezcla al menos 2 de estas tareas (filtro, agregación, comparacion temporal, formateo de salida), mover lógica a servicio.
- No duplicar filtros B2B/B2C dentro de múltiples handlers si se puede centralizar.

## Señales de violación
- Bloques de lógica repetidos entre `get_metrics`, `get_b2b_metrics` y `get_b2c_metrics`.
- Nuevos tipos/modelos definidos dentro del mismo archivo de rutas sin necesidad local.

## Como guía tareas reales en este repo
- Si se agrega `GET /api/metrics/trends`, crear función de servicio para agregación y dejar el endpoint como adaptador HTTP.
