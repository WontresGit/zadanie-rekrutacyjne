FROM php:8.4-cli-alpine

# install PDO Postgres
RUN apk add --no-cache \
    postgresql-dev \
    rabbitmq-c-dev \
    openssl \
    libsodium-dev \
    autoconf \
    make \
    && docker-php-ext-install pdo pdo_pgsql sodium 

RUN pecl install amqp-1.11.0 \
    && docker-php-ext-enable amqp

WORKDIR /srv/app

# composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
