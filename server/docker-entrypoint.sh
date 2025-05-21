#!/bin/sh

# Wait for the database to be ready
until npx prisma db push > /dev/null 2>&1; do
  echo "Waiting for the database..."
  sleep 2
done

echo "Database is ready. Running migrations and generating Prisma client..."
npx prisma migrate deploy
npx prisma generate

echo "Starting server..."
exec node dist/index.js 