FROM php:8.2-cli

# Install dependencies sistem
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nodejs npm

# Install ekstensi PHP yang dibutuhkan Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

# Install PHP & JS dependencies
RUN composer install --no-dev --optimize-autoloader
RUN npm install --legacy-peer-deps && npm run build

# Port Render
EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=10000