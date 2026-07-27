# Etapa de compilación (Build stage)
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copiar archivos de Gradle para aprovechar la caché de Docker
COPY gradle gradle
COPY gradlew build.gradle settings.gradle ./
RUN chmod +x gradlew
RUN ./gradlew dependencies --no-daemon || true

# Copiar el código fuente y construir el ejecutable .jar
COPY src src
RUN ./gradlew bootJar -x test --no-daemon

# Etapa de ejecución (Runtime stage)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

