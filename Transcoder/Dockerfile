# Usa la imagen base de Ubuntu
FROM ubuntu:latest

MAINTAINER Juan Navarro Maldonado y Joaquin Sergio Garcia Ibañez

# Actualiza los repositorios de paquetes e instala los paquetes necesarios
RUN apt-get update && \
    apt-get install -y \
    curl \
    vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


COPY vod.conf /app/vod.conf
