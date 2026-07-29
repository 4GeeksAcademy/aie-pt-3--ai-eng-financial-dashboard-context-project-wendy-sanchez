# Stack Tecnológico

## Frontend
### Núcleo
- React `^19.2.4`
- React DOM `^19.2.4`
- TypeScript `~6.0.2`
- Vite `^8.0.4`

### UI y visualización
- Recharts `^3.8.1` para gráficos de líneas y líneas de referencia.
- Lucide React `^1.8.0` para iconografía.
- Estilo utility-first con ecosistema Tailwind.

### Tooling de desarrollo frontend
- ESLint `^9.39.4` con plugins de TypeScript y React Hooks.
- Vitest `^4.1.4` junto a `@vitest/coverage-v8`.
- Scripts disponibles: `dev`, `build`, `lint`, `preview`, `test`, `test:watch`, `test:coverage`.

## Backend
### Núcleo
- FastAPI
- Uvicorn con extras estándar (`uvicorn[standard]`)
- Modelos Pydantic (a través del stack de FastAPI)

### Pruebas y depuración
- pytest
- pytest-cov
- httpx
- debugpy (expuesto en compose para attach de depuración)

### Estilo actual del backend
- Router HTTP y lógica de dominio en `backend/app/routes.py`.
- Generación de dataset sintético en memoria usando `random` y utilidades de fecha.

## Infraestructura y ejecución local
### Contenerización
- Dockerfiles en `frontend/` y `backend/`.
- `docker-compose.yml` orquesta ambos servicios.

### Puertos expuestos
- Frontend: `5173:5173`
- API backend: `8000:8000`
- Debug backend: `5678:5678`

### Volúmenes
- Bind mounts de `./frontend:/app` y `./backend:/app` para desarrollo en vivo.
- Node modules aislado con volumen anónimo (`/app/node_modules`).

## Dependencias clave por importancia
### Críticas para producto/ejecución
- React, FastAPI, Uvicorn, Recharts.

### Calidad y confiabilidad
- ESLint, TypeScript, Vitest, pytest, pytest-cov.

### Productividad de desarrollo
- debugpy, Vite, toolchain de React.

## Mapa de evidencia
- Dependencias y scripts frontend: `frontend/package.json`
- Dependencias backend: `backend/requirements.txt`
- Orquestación de servicios: `docker-compose.yml`
- Uso de framework backend: `backend/app/main.py`, `backend/app/routes.py`
