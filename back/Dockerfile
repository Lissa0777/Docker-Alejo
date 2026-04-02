# Stage 1: instalar dependencias
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install

# Stage 2: imagen final limpia
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY server.js .
COPY package.json .
EXPOSE 3000
CMD ["node", "server.js"]
