FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /workspace/app
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=builder /workspace/app/target/realestate-0.0.1-SNAPSHOT.jar ./realestate.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "realestate.jar"]
