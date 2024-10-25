# 使用 OpenJDK 17 作为基础镜像
FROM openjdk:17-jdk-alpine

# 创建工作目录
WORKDIR /app

# 复制打包好的 Spring Boot Jar 包到容器中
COPY target/Neighbourhood-Walk-0.0.1-SNAPSHOT.jar /app/app.jar

# 设置环境变量
ENV SPRING_PROFILES_ACTIVE=prod
ENV DB_HOST=neighbourhood-walk-mysql
ENV DB_USERNAME=root
ENV DB_PASSWORD=123456

# 暴露端口
EXPOSE 8080

# 运行应用
CMD ["java", "-jar", "/app/app.jar"]
