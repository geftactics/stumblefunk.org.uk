FROM php:7.2-apache

RUN docker-php-ext-install pdo_mysql && apt-get update && apt-get install -y mysql-client && rm -rf /var/lib/apt

COPY src/ /var/www/html/

