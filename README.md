# E-VAS Task API

Run the API with Docker (app + MongoDB + Redis), then seed and test.

## Requirements

- Docker and Docker Compose

## Environment file

Copy the example environment file:

```bash
cp .env.example .env
```

## Run the project with Docker

Start all services (app, MongoDB, Redis):

```bash
docker compose up --build -d
```

To see logs:

```bash
docker compose logs -f app
```

API docs will be available at:

- `http://localhost:3000/docs`

## Cron job

The app includes a scheduled cron job for orders:

- Runs every day at midnight.
- Finds orders older than 30 days.
- Marks them as archived by setting `isArchived` to `true`.
- Writes log entries for success/failure in the app logs.

## Seed data

Seed sample data from inside the app container:

```bash
docker compose exec app pnpm run seed
```

Seeder output includes default admin credentials.

## Run tests

Run unit tests:

```bash
docker compose exec app pnpm run test
```

## Stop services

```bash
docker compose down
```
