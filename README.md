# Turnos en línea · proyecto base de CI y CD (Sesión 10, ampliación)

Sistema mínimo para reservar turnos (datos en memoria, interfaz web incluida) con un **pipeline de CI** completo
y un **workflow de CD** que despliega en Render cuando el CI termina bien en `main`. Requiere Node.js 22 o superior.

## Estructura

| Ruta | Contenido |
|---|---|
| `src/dominio/` | Reglas de negocio (no conoce HTTP). |
| `src/api/` | Servidor HTTP: API, ruta `/salud` y archivos de la interfaz. |
| `public/` | Interfaz web (`index.html`, `app.js`, `estilos.css`). |
| `tests/` | Pruebas: dominio, API, arquitectura (función de aptitud), contrato y módulos. |
| `api/openapi.yaml` | Contrato de la API; `.spectral.yaml` son las reglas del equipo. |
| `.github/workflows/` | `ci.yml` (cuatro puertas), `codeql.yml` (análisis estático), `release.yml` (versión y changelog) y `cd.yml` (despliegue). |
| `.github/dependabot.yml` | Actualización semanal de dependencias y acciones. |
| `render.yaml` | Descripción del servicio en Render (opcional: también se crea desde el panel). |
| `scripts/` | Escáner de secretos, prueba de humo del despliegue y métricas DORA. |
| `mejora/` | Código de la mejora que se integra en la práctica (resumen de la agenda en la interfaz). Refleja la estructura del proyecto. |
| `docs/` | Decisión de arquitectura (ADR-001). |
| `.pre-commit-config.yaml` | Hooks locales. |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala las herramientas de desarrollo y crea `package-lock.json` (la primera vez). |
| `npm start` | Levanta la aplicación en `http://localhost:3000` (o en el puerto de la variable `PORT`). |
| `npm run lint` | Revisa estilo y errores simples (ESLint). |
| `npm test` | Ejecuta todas las pruebas. |
| `npm run cobertura` | Pruebas con cobertura; falla si las líneas cubiertas son menos del 90 %. |
| `npm run secretos` | Busca claves en los archivos del repositorio. |
| `npm run auditoria` | Busca dependencias con vulnerabilidades conocidas (CVE). |
| `npm run contrato` | Valida `api/openapi.yaml` con Spectral. |
| `npm run docs` | Genera la documentación HTML del contrato en `docs-generada/`. |
| `npm run dora` | Calcula métricas tipo DORA con `data/despliegues.json` (datos ilustrativos). |
| `npm run verificar` | Ejecuta localmente las puertas principales, en el orden del pipeline. |

## Uso en la práctica

Seguir el documento de clase de la práctica de CD. Los workflows ya están fijados a un commit completo;
`cd.yml` necesita en GitHub el secreto `RENDER_DEPLOY_HOOK` (entorno `produccion`) y la variable `URL_PRODUCCION`.
