# Prerequisites
Before running the project, make sure the following tools are installed on your machine:

✅ If running the project without Docker (locally):
Node.js (v18 or higher)

npm – comes bundled with Node.js

PostgreSQL – make sure PostgreSQL is installed and running locally

✅ If running the project with Docker:
Docker – Install Docker Desktop

Docker Compose – included with Docker Desktop



## Install Dependencies

```bash
npm install
```

---

## Build the Application

```bash
npm run build
```

---

## Running the Application with Docker

### 1. Start the Docker Containers

To start the application and PostgreSQL container using Docker Compose, run the following command:

```bash
docker-compose up
```
### 2. Check if the Containers Are Running
To check if the containers are up and running, you can use the following command:

```bash
docker ps
```
### 3. Connect to PostgreSQL
To connect to the PostgreSQL container and verify the database connection, run the following command:

```bash
docker exec -it <container_id> psql -U popcorn-palace -d popcorn-palace
```
Replace <container_id> with the actual container ID of your PostgreSQL container, which you can obtain from the docker ps command. This command will allow you to access the PostgreSQL database from within the container and execute SQL queries.

### 4. Run the app locally
To run the application locally, use the following command:
```bash
npm run start:dev
```
---

## Running Tests

### Unit Tests with Coverage

```bash
npm run test:cov
```

### Watch Mode (Auto re-run on file changes)

```bash
npm run test:watch
```

### E2E Tests

```bash
npm run test:e2e
```

### E2E Tests with Coverage

```bash
npm run test:e2e:cov
```

---

## Lint and Format

```bash
npm run lint
npm run format
```

---


## Notes

- Default server runs on port `3000`
- You can configure Docker settings in the `docker-compose.yml` and `Dockerfile`
- The codebase uses NestJS and TypeORM

---

Enjoy building with 🍿 **Popcorn Palace**!





