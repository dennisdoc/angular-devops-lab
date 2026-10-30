FROM node:26-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --global npm@12.2.1 && npm ci

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angular-devops-lab/browser /usr/share/nginx/html

EXPOSE 8080
