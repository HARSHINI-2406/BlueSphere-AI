# Stage 1: Build static React bundles
FROM node:18-alpine AS build

WORKDIR /workspace

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve React assets using Nginx
FROM nginx:stable-alpine

COPY --from=build /workspace/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
