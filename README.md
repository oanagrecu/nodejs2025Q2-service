# Home Library Service

# Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/oanagrecu/nodejs2025Q2-service.git
```

```bash
cd nodejs2025Q2-service
```

## 2. Configure .env

Create a .env file based on .env.example:

## 3 .Running with Docker

### Build & Start

```bash

docker-compose up --build
```

### Stop the project:

```bash
docker compose down -v
```

### This starts both the NestJS app and a PostgreSQL container.

## Access the API at:

http://localhost:4000

## Testing Functionality

npm test -- test/users.e2e.spec.ts
npm test -- test/artists.e2e.spec.ts
npm test -- test/albums.e2e.spec.ts
npm test -- test/favorites.e2e.spec.ts
npm test -- test/tracks.e2e.spec.ts
`
Use a REST client (e.g., Postman)

Users
POST /user
GET /user/:id
PUT /user/:id
DELETE /user/:id

Auth
POST /auth/login with { login, password }
returns JWT token if credentials match
Artist / Album / Track / Favorites
Full CRUD
Favorite management (/favs route)

## Linting

```bash
npm run lint
```

### Security Scan (Docker Scout)

```bash
docker scout quickview oanaalexandra81/home-library:latest
```

```bash
docker scout cves oanaalexandra81/home-library:latest
```

Base image suggestions and CVEs are listed in build output.

### Pushed Docker Image

You can pull and run the image directly:

```bash
docker pull oanaalexandra81/home-library:latest
```

```bash
docker run -p 3000:3000 --env-file .env oanaalexandra81/home-library:latest
```

### Database Schema (PostgreSQL)

`docker exec -it postgres_db psql -U postgres -d home_library`

Tables created:
user
artist
album
track
favorites

You can insert test data directly using psql CLI or a database GUI
sql

```bash
INSERT INTO artist (name, grammy) VALUES ('QUEEN', TRUE);
```
