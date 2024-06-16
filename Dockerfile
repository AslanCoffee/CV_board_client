# Строительный этап
FROM node:16-alpine AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
