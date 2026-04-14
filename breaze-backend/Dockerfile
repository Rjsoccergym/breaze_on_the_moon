# --- ETAPA 1: Construcción (Build) ---
FROM maven:3.9-eclipse-temurin-21 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos todo el contenido del backend 
COPY . .

# Ejecutamos la compilación de todos los módulos. 
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecución (Runtime) ---
FROM eclipse-temurin:21-jre-alpine


ARG MODULE_NAME
WORKDIR /app

# Copiamos el archivo .jar generado en la etapa de build.

COPY --from=build /app/${MODULE_NAME}/target/*.jar app.jar

# Comando para iniciar el microservicio
ENTRYPOINT ["java", "-jar", "app.jar"]