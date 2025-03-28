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

## Run the Application

### With Docker Compose (Recommended)

```bash
docker-compose up --build
```

### Without Docker (Local Development Mode)

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

## Environment Variables

If needed, create a `.env` file based on a `.env.example` file and set values like database connection or custom ports.

---

## Notes

- Default server runs on port `3000`
- You can configure Docker settings in the `docker-compose.yml` and `Dockerfile`
- The codebase uses NestJS and TypeORM

---

Enjoy building with 🍿 **Popcorn Palace**!

