# Aplicación Web Completa con Docker

Aplicación de gestión de usuarios compuesta por tres servicios dockerizados: frontend en React, backend en Node.js + Express, y base de datos MySQL.

## Tecnologías utilizadas

- **Frontend:** React 18, Nginx (proxy inverso)
- **Backend:** Node.js, Express
- **Base de datos:** MySQL 8.0

## Estructura del repositorio

```
/
├── back/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── front/
│   ├── src/
│   ├── public/
│   ├── nginx.conf
│   ├── package.json
│   └── Dockerfile
└── README.md
```

## Instrucciones de despliegue

### 1. Crear las redes Docker

```bash
docker network create red-front-back
docker network create red-back-bd
```

### 2. Crear el volumen para la base de datos

```bash
docker volume create mysql-data
```

### 3. Iniciar la base de datos

```bash
docker run -d \
  --name database \
  --network red-back-bd \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=testdb \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0
```

### 4. Construir la imagen del backend (multi-stage)

```bash
docker build -t imagen-backend ./back
```

### 5. Ejecutar el backend

```bash
docker run -d \
  --name backend \
  --network red-back-bd \
  -e DB_HOST=database \
  -e DB_USER=root \
  -e DB_PASSWORD=root \
  -e DB_NAME=testdb \
  -e DB_PORT=3306 \
  -p 3000:3000 \
  imagen-backend

docker network connect red-front-back backend
```

### 6. Construir la imagen del frontend (multi-stage)

```bash
docker build -t imagen-frontend ./front
```

### 7. Ejecutar el frontend

```bash
docker run -d \
  --name frontend \
  --network red-front-back \
  -p 8080:80 \
  imagen-frontend
```

### 8. Abrir la aplicación

Abre el navegador en: **http://localhost:8080**

---

## Comandos para detener y limpiar

```bash
docker stop frontend backend database
docker rm frontend backend database
docker rmi imagen-frontend imagen-backend
docker network rm red-front-back red-back-bd
docker volume rm mysql-data
```
