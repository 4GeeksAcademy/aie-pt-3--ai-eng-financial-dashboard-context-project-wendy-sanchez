# Regla 05 - Documentación y DX operables

## Nombre
Documentación y DX operables

## Alcance
- `README.md`, `README.es.md`, `AGENTS.md`
- `docker-compose.yml`
- Scripts de desarrollo en `frontend/package.json` y comandos de backend

## Razón
La documentación define cómo correr el proyecto y cómo trabajar con agentes. Debe mantenerse alineada con la estructura real para evitar fricción en onboarding.

## Regla operativa
1. Si cambia el flujo de ejecución, actualizar README en el mismo cambio.
2. Si se exige una ruta operativa (por ejemplo `.agents/rules`), la ruta debe existir o proveerse plantilla.
3. Todo cambio de DX (scripts, puertos, comandos) debe incluir pasos claros de validación.

## Criterios verificables
- Cambios en `docker-compose.yml` deben reflejarse en README si alteran puertos o forma de correr.
- Si `AGENTS.md` menciona directorios obligatorios, esos directorios deben existir en repo.
- Nuevos comandos de test/lint deben ser ejecutables desde scripts o documentados.

## Señales de violación
- Instrucciones que no coinciden con estado real del repositorio.
- Dependencias o comandos agregados sin guía mínima para ejecutarlos.

## Como guía tareas reales en este repo
- Si se agrega un servicio nuevo en compose, documentar endpoint, puerto y comando de arranque en README.
