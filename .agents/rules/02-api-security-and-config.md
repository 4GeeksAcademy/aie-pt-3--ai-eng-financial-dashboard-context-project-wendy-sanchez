# Regla 02 - Seguridad de API y configuración por entorno

## Nombre
Seguridad de API y configuración por entorno

## Alcance
- `backend/app/main.py`
- `docker-compose.yml`
- Cambios relacionados con CORS, puertos, variables de entorno y exposición de servicios

## Razón
Actualmente CORS está abierto para cualquier origen. Esto es útil en local, pero riesgoso si se promueve igual en entornos compartidos o productivos.

## Regla operativa
1. CORS debe depender del entorno (`dev`, `staging`, `prod`) y no quedar fijo con wildcard en producción.
2. En producción, `allow_origins` debe ser lista explicita.
3. Configuración sensible y parámetros de despliegue deben venir de variables de entorno.
4. Solo exponer puertos estrictamente necesarios por entorno.

## Criterios verificables
- No usar `allow_origins=["*"]` junto con credenciales habilitadas fuera de desarrollo local.
- Cambios a CORS deben incluir nota en documentación de ejecución o ejemplo de variables.
- Si se modifica `docker-compose.yml`, validar que los puertos expuestos sigan siendo necesarios.

## Señales de violación
- Cambios que agregan más puertos sin justificación de debugging o acceso funcional.
- Credenciales cross-origin habilitadas sin lista de origenes permitidos.

## Como guía tareas reales en este repo
- Si se prepara entorno staging, agregar lista de orígenes para frontend en CORS y evitar wildcard.
