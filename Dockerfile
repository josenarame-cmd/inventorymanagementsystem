# Frontend Build stage
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend Build stage
FROM gradle:8.5-jdk17 AS backend-build
WORKDIR /app
COPY . .
# Copy the built frontend to Spring Boot's static resources
COPY --from=frontend-build /app/src/main/resources/static/ /app/src/main/resources/static/
# Fix permissions for gradlew
RUN chmod +x gradlew
# Run Gradle with very low memory settings for Render free tier
RUN ./gradlew build --no-daemon -x test -Dorg.gradle.jvmargs="-Xmx256m -XX:MaxMetaspaceSize=128m"

# Final Package stage
FROM eclipse-temurin:17-jre-focal
COPY --from=backend-build /app/build/libs/InventoryManagementSystem-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "/app.jar"]
