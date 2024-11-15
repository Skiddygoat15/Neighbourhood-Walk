# Using Node.js as a base image
FROM node:18-alpine

# Setting up the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install the dependencies.
COPY package.json package-lock.json /app/

# Installation of dependencies
RUN npm install


# 5. Accepting build parameters
# ARG ESLINT_NO_DEV_ERRORS

# 6. Define environment variables (make sure to receive them from the build parameters)
# ENV ESLINT_NO_DEV_ERRORS=${ESLINT_NO_DEV_ERRORS}

# Copy all the files of the front-end project
COPY . /app

# Building Next.js Applications
RUN npm run build

# Launching the Next.js application
EXPOSE 3000
CMD ["npm", "start"]
