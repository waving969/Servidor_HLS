FROM ubuntu:14.04
MAINTAINER Juan Navarro Maldonado y Joaquin Sergio Garcia Ibañez

# update, wget, gcc, g++, build essential
RUN apt update && apt-get install -y build-essential systemd wget

RUN apt-get update && \
    apt-get install -y \
    libpcre3 \
    libpcre3-dev \
    zlib1g \
    zlib1g-dev \
    libssl-dev \
    build-essential \
    wget \
    curl \
    gnupg2 \
    ca-certificates

#RUN mv /etc/nginx.conf /etc/nginx.conf.old
COPY nginx.service etc/nginx/nginx.service
#Copiar el archivo de configuracion de proxy que hemos creado

COPY proxy.conf /etc/nginx/nginx.conf

COPY scriptConf.sh ./

RUN chmod +x scriptConf.sh 

EXPOSE 443
EXPOSE 80

CMD ["tail", "-f", "/dev/null"]