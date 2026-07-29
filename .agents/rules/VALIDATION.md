# Validación de reglas en este repositorio

## Objetivo
Comprobar que cada regla creada en `.agents/rules` es aplicable al flujo real del proyecto y no queda genérica.

## Regla 01 - Backend modular por capas ligeras
- Evidencia en repo:
  - `backend/app/routes.py` concentra handlers, modelos y lógica de dominio.
  - Endpoints y funciones de negocio coexisten en el mismo archivo.
- Tareas que puede guiar hoy:
  - Agregar endpoint nuevo sin crecer el monolito de rutas.
  - Extraer filtros/agregaciones repetidas a servicio reutilizable.
- Refinamiento aplicado:
  - Se cambió criterio ambiguo de "25-30 lineas" a umbral concreto: mas de 30 lineas y mezcla de al menos 2 responsabilidades.

## Regla 02 - Seguridad de API y configuración por entorno
- Evidencia en repo:
  - `backend/app/main.py` usa `allow_origins=["*"]` y `allow_credentials=True`.
  - `docker-compose.yml` expone puertos de app y debugging.
- Tareas que puede guiar hoy:
  - Hardening de CORS para staging/prod.
  - Revisión de exposición de puertos por entorno.
- Refinamiento aplicado:
  - Criterios concretos para cambios de CORS y compose con validación documental.

## Regla 03 - Puertas mínimas de testing
- Evidencia en repo:
  - Backend: pruebas funcionales en `backend/tests/test_routes.py`.
  - Frontend: solo existe `frontend/src/lib/financial-utils.test.ts`.
- Tareas que puede guiar hoy:
  - Agregar pruebas de casos invalidos de endpoint.
  - Cubrir estados de componentes de dashboard.
- Refinamiento aplicado:
  - Se definió que es "componente crítico" en este repo para evitar interpretación abierta.

## Regla 04 - Frontend: datos, estados e i18n consistente
- Evidencia en repo:
  - Fetch principal en `frontend/src/App.tsx`.
  - Formateo en `frontend/src/lib/financial-utils.ts` con `Intl.NumberFormat` y `toLocaleDateString`.
- Tareas que puede guiar hoy:
  - Evitar duplicar formateadores en componentes.
  - Estandarizar manejo de error/carga/vacío en nuevas vistas.
- Refinamiento aplicado:
  - Se reemplazó "cuando crezca" por trigger medible: si locale/periodo aparece en 2 o más archivos, centralizar.

## Regla 05 - Documentación y DX operables
- Evidencia en repo:
  - `AGENTS.md` exige rutas de agentes.
  - README define runbook de compose y endpoints.
- Tareas que puede guiar hoy:
  - Mantener docs alineadas si cambian scripts, puertos o flujo de arranque.
  - Evitar requisitos operativos sin estructura real en repo.
- Refinamiento aplicado:
  - Criterios de verificabilidad ligados a README, AGENTS y compose.

## Resultado final de validacion
- Regla 01: valida y util para evolutivos de backend.
- Regla 02: valida y util para hardening operativo.
- Regla 03: valida y util para evitar regresiones.
- Regla 04: valida y util para consistencia de UI y datos.
- Regla 05: valida y util para onboarding y DX.
