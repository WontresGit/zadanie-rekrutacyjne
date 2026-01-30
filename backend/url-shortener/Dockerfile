FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpq-dev \
    librabbitmq-dev \
    libssl-dev \
    libsodium-dev \
    autoconf \
    make \
    gcc \
    g++ \
    && docker-php-ext-install pdo pdo_pgsql sodium \
    && pecl install amqp \
    && docker-php-ext-enable amqp \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /srv/app

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer