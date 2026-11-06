# ADR-001 · Separación de capas

- **Estado:** aceptada
- **Contexto:** el sistema tiene reglas de negocio (reservar, cancelar) y una interfaz HTTP.
- **Decisión:** la capa `src/dominio` contiene las reglas y **no depende** de `src/api`. La API sí depende del dominio.
- **Consecuencias:** el dominio se prueba sin servidor y se puede reutilizar con otra interfaz.
- **Verificación automática:** `tests/arquitectura.test.js` (función de aptitud) falla si un archivo del dominio importa la API.
