#!/bin/sh
set -e
echo "Waiting for database..."
cd /srv/app
echo "Waiting for database2..."
until pg_isready -h database -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  sleep 1
done
echo "Database is ready"
if [ ! -d vendor ]; then
  echo "Installing composer dependencies..."
  composer install --no-interaction --prefer-dist --optimize-autoloader
fi
# echo "Running migrations..."
# php bin/console make:migration
# php bin/console doctrine:migrations:migrate --no-interaction

echo "Starting app..."
exec "$@"