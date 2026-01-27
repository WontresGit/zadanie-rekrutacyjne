FROM php:8.4-cli-alpine

# install PDO Postgres
RUN apk add --no-cache \
    postgresql-dev \
    openssl \
    libsodium-dev \
    && docker-php-ext-install pdo pdo_pgsql sodium

WORKDIR /srv/app

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
