# Architecture Notes

## Production Target

This app is intended to run on AWS ECS Fargate behind an ALB using a blue/green deployment strategy.

In production:

- Blue and Green are separate ECS task sets or service revisions.
- PostgreSQL is externalized to Amazon RDS.
- Redis session storage is externalized to Amazon ElastiCache.
- Containers remain stateless and receive configuration via environment variables.

Required environment variables:

- `DATABASE_URL`
- `REDIS_URL`
- `APP_VERSION`

## Local Development

Local development uses `docker-compose.dev.yml` to simulate the shared infrastructure:

- `postgres` container simulates RDS
- `redis` container simulates ElastiCache
- `frontend` and `backend` containers run the application

Start the local simulation with:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## State Ownership

- Shopping cart state is stored in Redis via `express-session` and `connect-redis`.
- Order data is stored in PostgreSQL.
- The browser stores only the session cookie, not the cart contents.

## Blue/Green Compatibility

- Both Blue and Green must point to the same RDS database and the same ElastiCache Redis cluster.
- Schema changes must follow expand/contract so both versions can run concurrently during cutover.
