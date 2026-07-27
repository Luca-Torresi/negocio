# AGENTS.md - Reglas y Contexto del Proyecto

## Contexto del Negocio y Despliegue
- **Proyecto:** Pañalera (Negocio).
- **Producción:** Se ejecuta de forma local en la PC del negocio (Windows) usando MySQL local + `iniciar.bat` + ejecutable `.jar` compilado en puerto 8080.
- **Desarrollo:** Entorno Docker con `docker-compose` en WSL2 (Ubuntu).
  - MySQL (`db`): incluye `--lower_case_table_names=1` para mantener compatibilidad de nombres de tabla de Windows en Linux.
  - Backend (`backend`): Spring Boot Java 17 en puerto 8080.
  - Frontend (`frontend`): React + Vite en puerto 5173.

Para más detalles, consultar [.gemini/rules/contexto_despliegue_proyecto.md](file://.gemini/rules/contexto_despliegue_proyecto.md).
