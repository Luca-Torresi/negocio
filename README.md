# Sistema de Gestión para Pañalera 🍼

Un sistema de punto de venta (POS) y gestión de inventario completo, construido con Spring Boot y React, diseñado para las necesidades de un pequeño comercio. La aplicación funciona como un programa de escritorio, empaquetada en un único ejecutable para una fácil instalación.

## Tecnologías Utilizadas 🛠️

### Backend
* **Java 17**
* **Spring Boot 3**
* **Spring Data JPA / Hibernate**
* **Gradle**
* **MySQL**
* **Lombok**
* **MapStruct**

### Frontend
* **React 18** con **TypeScript**
* **Vite** como herramienta de construcción
* **React Router Dom** para el enrutamiento
* **Zustand** para el manejo de estado global
* **Tailwind CSS** para los estilos
* **Axios** para las peticiones a la API
* **React Google Charts** para las visualizaciones de datos
* **Lucide React** para los íconos

## Requisitos Previos
* Java JDK 17 o superior.
* Node.js 18 o superior.

## Instalación y Puesta en Marcha (Entorno de Desarrollo)

Sigue estos pasos para levantar el entorno de desarrollo.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Luca-Torresi/negocio.git
    cd negocio
    ```

2.  **Configurar el Backend:**
    * Abre la carpeta `backend/` con IntelliJ IDEA.
    * Deja que Gradle sincronice las dependencias.
    * Establecer la siguiente propiedad dentro de application.properties: `spring.jpa.hibernate.ddl-auto=update`.

3.  **Configurar el Frontend:**
    * Abre una terminal y navega a la carpeta del frontend.
    * ```bash
        cd frontend
        npm install
        ```

## Cómo Ejecutar la Aplicación (Desarrollo)

Para trabajar en la aplicación, necesitas ejecutar ambos servidores al mismo tiempo.

1.  **Levantar el Backend:**
    * Desde IntelliJ IDEA, ejecutar la clase principal `NegocioApplication`.
    * El servidor se iniciará en `http://localhost:8080`.

2.  **Levantar el Frontend:**
    * En una terminal, dentro de la carpeta `frontend/`, ejecuta:
    * ```bash
        npm run dev
        ```
    * La aplicación estará disponible en `http://localhost:5173`.

## Empaquetado para Producción (Aplicación de Escritorio) 📦

Sigue estos pasos para crear el archivo `.jar` ejecutable que contiene toda la aplicación.

1.  **Construir el Frontend:**
    * En la terminal, dentro de la carpeta `frontend/`, ejecuta:
    * ```bash
        npm run build
        ```
    * Esto creará una carpeta `dist/` con los archivos de producción.

2.  **Copiar los Archivos del Frontend al Backend:**
    * Copia **todo el contenido** de la carpeta `frontend/dist/`.
    * Pégalo dentro de la carpeta `backend/src/main/resources/static/`. Si la carpeta `static` no existe, créala.

3.  **Construir el Backend:**
    * En una terminal, dentro de la carpeta `backend/`, ejecuta:
    * ```bash
        ./gradlew bootJar
        ```
    * El archivo ejecutable final se encontrará en `backend/build/libs/` (ej: `negocio-0.0.1-SNAPSHOT.jar`).

4.  **Crear el Paquete Final:**
    * Crea una nueva carpeta en el destino final (ej: "Sistema Pañalera").
    * Copia el archivo `.jar` dentro de ella.
    * Crea el archivo `iniciar.bat` con el siguiente script:
    * ```bash
         @echo off
         REM Inicia el servidor en segundo plano sin una ventana de terminal visible
         start "Servidor Negocio" javaw -jar negocio-0.0.1-SNAPSHOT.jar

         REM Esperamos unos segundos para asegurar que el servidor haya arrancado
         timeout /t 8 /nobreak > NUL

         REM Abre la aplicación en el navegador
         start http://localhost:8080
         ```
6.  **Ejecutar la Aplicación:**
    * Doble click en el archivo `iniciar.bat` para levantar el servidor.
    * La aplicación se abrirá en el navegador predeterminado.

        

  
