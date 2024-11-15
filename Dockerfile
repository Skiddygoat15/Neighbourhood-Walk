# Using OpenJDK 17 as the base image
FROM openjdk:17-jdk-alpine

# Creating a working directory
WORKDIR /app

# Copy the packaged Spring Boot Jar package into the container
COPY target/Neighbourhood-Walk-0.0.1-SNAPSHOT.jar /app/app.jar

# Setting environment variables
ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_HOST=neighbourhood-walk-mysql
ENV DB_USERNAME=root
ENV DB_PASSWORD=123456

# exposed port
EXPOSE 8080

# Running the application
CMD ["java", "-jar", "/app/app.jar"]
