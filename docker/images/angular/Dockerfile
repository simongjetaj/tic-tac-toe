# Stage 1: Compile and Build angular codebase
FROM node:16-alpine as build

# Set the working directory
WORKDIR /app

COPY ./angular-client/package*.json /app

RUN npm install

COPY ./angular-client /app

RUN npm run build


# Stage 2: Serve app with nginx server
FROM nginx:1.21.4-alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/angular-client /usr/share/nginx/html

EXPOSE 80
