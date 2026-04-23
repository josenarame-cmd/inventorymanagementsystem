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
COPY --from=frontend-build /app/frontend/dist/ /app/src/main/resources/static/
RUN ./gradlew build --no-daemon -x test

# Final Package stage
FROM eclipse-temurin:17-jre-focal
COPY --from=backend-build /app/build/libs/inventorymanagementsystem-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "/app.jar"]
