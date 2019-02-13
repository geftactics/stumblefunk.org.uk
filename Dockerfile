FROM php:7.2-apache

RUN docker-php-ext-install pdo_mysql

COPY src/ /var/www/html/

#EXPOSE 80

#FROM ulsmith/alpine-apache-php7
#ADD /src /app/public
#RUN chown -R apache:apache /app
