# 使用 Node.js 作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 安装依赖
COPY package.json package-lock.json /app/

# 安装依赖
RUN npm install


# 5. 接受构建参数
# ARG ESLINT_NO_DEV_ERRORS

# 6. 定义环境变量（确保从构建参数中接收）
# ENV ESLINT_NO_DEV_ERRORS=${ESLINT_NO_DEV_ERRORS}

# 复制前端项目所有文件
COPY . /app

# 构建 Next.js 应用
RUN npm run build

# 启动 Next.js 应用
EXPOSE 3000
CMD ["npm", "start"]
