# Contexto y Configuración del Proyecto - Negocio (Pañalera)

## 1. Información General del Proyecto
- **Propósito:** Aplicación web diseñada para la gestión de un negocio (específicamente una pañalera).
- **Tecnologías:**
  - **Backend:** Java 17 (Spring Boot)
  - **Base de Datos:** MySQL 8.0
  - **Frontend:** React + Vite + TypeScript

---

## 2. Entorno de Producción Local (Computadora del Negocio)
El cliente no utiliza servidor remoto ni suscripción mensual. La aplicación corre en su computadora local (Windows) con la siguiente estructura:

- **MySQL:** Instalado directamente en la computadora del negocio.
- **Ubicación de archivos:** En una carpeta local se encuentra el archivo compilado ejecutable `.jar` y el script de inicio `iniciar.bat`.
- **Acceso directo:** Existe un acceso directo en el escritorio apuntando a `iniciar.bat`.

### Script `iniciar.bat`:
```cmd
@echo off
REM Inicia el servidor en segundo plano sin una ventana de terminal visible
start "Servidor Negocio" javaw -jar negocio-0.0.1-SNAPSHOT.jar

REM Esperamos unos segundos para asegurar que el servidor haya arrancado
timeout /t 8 /nobreak > NUL

REM Abre la aplicación en el navegador
start http://localhost:8080
```

- Al abrir el acceso directo en la PC del local, arranca el ejecutable Java y abre el navegador en `http://localhost:8080`.

---

## 3. Entorno de Desarrollo (Desarrollador)
- **Entorno:** Docker corriendo en Ubuntu con WSL2 sobre Windows.
- **Orquestación:** `docker-compose` con 3 servicios:
  - `db`: MySQL 8.0 con el parámetro `--lower_case_table_names=1` (insensible a mayúsculas/minúsculas como en Windows), volumen persistente `mysql_data` e importación inicial mediante `./dump.sql`.
  - `backend`: Java 17 Spring Boot compilado con multi-stage Dockerfile (Gradle), escuchando en puerto `8080`.
  - `frontend`: React con Vite, escuchando en puerto `5173` con soporte para Hot Reloading en WSL2.
