# Servidor HLS

## Descripción
Este proyecto implementa un servidor de streaming de video utilizando el protocolo HTTP Live Streaming (HLS). El sistema está diseñado para proporcionar una solución escalable y segura para la entrega de contenido multimedia a través de internet.

## Arquitectura del Sistema
El sistema está compuesto por varios componentes que trabajan juntos:

1. **CDN (Content Delivery Network)**: Maneja la distribución del contenido a los usuarios finales.
2. **Transcoder**: Convierte y prepara los videos para streaming HLS.
3. **Balanceador de Carga**: Distribuye las solicitudes entre los servidores.
4. **Almacenamiento**: Utiliza Wasabi S3 como sistema de almacenamiento en la nube.

## Requisitos Previos
- Docker y Docker Compose
- Node.js (para las herramientas locales)
- Cuenta en Wasabi (compatible con S3)

## Configuración del Sistema

### 1. Configuración de Red Docker
Primero, crea una red Docker para la comunicación entre contenedores:

```bash
docker network create --subnet=192.168.10.0/24 my_bridge
```

### 2. Configuración de Wasabi S3
Para conectar el sistema con Wasabi S3, necesitas:

1. Crear una cuenta en Wasabi
2. Crear un bucket para almacenar los videos
3. Obtener las credenciales de acceso (Access Key y Secret Key)
4. Actualizar los archivos de configuración con tus credenciales

### 3. Configuración de los Archivos
Actualiza los siguientes archivos con tus credenciales de Wasabi:

#### En `/ServidorUbuntu/vod.conf` y `/Transcoder/vod.conf`:
```nginx
aws_auth $aws_token {
    access_key TU_ACCESS_KEY;
    secret_key TU_SECRET_KEY;
    service s3;
    region TU_REGION;
}
```

#### En `/Local/aws.js`:
```javascript
const s3 = new AWS.S3({
    apiVersion: 'latest',
    region: 'TU_REGION',
    accessKeyId: 'TU_ACCESS_KEY',
    secretAccessKey: 'TU_SECRET_KEY',
    endpoint: 'https://s3.TU_REGION.wasabisys.com',
})
```

### 4. Configuración de Seguridad
Para proteger tus videos, actualiza la clave secreta en:

#### En `/Local/hashName.js`:
```javascript
function hashName(name, invert) {
    const secret = 'TU_CLAVE_SECRETA'
    // ... existing code ...
}
```

#### En los archivos de configuración de Nginx:
Busca la línea `secure_link_md5` y actualiza la clave secreta:
```nginx
secure_link_md5 "$secure_link_expires $http_x_real_ip TU_CLAVE_SECRETA";
```

## Construcción y Despliegue

### 1. Construir las Imágenes Docker
```bash
# Construir la imagen del CDN
docker build -t servidorhls:pf ./CDN

# Construir la imagen del Transcoder
docker build -t transcoder:pf ./Transcoder

# Construir la imagen del Balanceador
docker build -t balanceador:pf ./BalanceadorNginx
```

### 2. Iniciar los Servicios
```bash
docker-compose up -d
```

## Uso del Sistema

### 1. Subir Videos a Wasabi
Utiliza el script de Node.js para subir videos a Wasabi:

```bash
cd Local
npm install
node aws.js ruta/al/video.mp4
```

### 2. Generar URLs Seguras
Para generar una URL segura para un video:

```bash
node vod-unique-url.js nombre_video IP_CLIENTE calidades
```

Ejemplo:
```bash
node vod-unique-url.js mi_video 192.168.1.1 720p,480p,360p
```

## Componentes del Sistema

### Transcoder
El Transcoder se encarga de:
- Convertir videos a diferentes calidades
- Generar los segmentos HLS
- Aplicar seguridad mediante tokens

### CDN
El CDN se encarga de:
- Distribuir el contenido a los usuarios
- Cachear los segmentos de video
- Validar los tokens de seguridad

### Balanceador de Carga
Distribuye las solicitudes entre múltiples instancias de Transcoder y CDN para mejorar la escalabilidad.

## Seguridad
El sistema implementa varias capas de seguridad:
- URLs firmadas con tiempo de expiración
- Validación de IP del cliente
- Posibilidad de restricción por referrer

## Personalización

### Cambiar la Duración de los Segmentos
En los archivos de configuración, modifica:
```nginx
vod_segment_duration 10000;
```

### Configurar CORS
Para permitir el acceso desde dominios específicos:
```nginx
add_header Access-Control-Allow-Origin 'http://tudominio.com';
```

### Configurar Caché
Ajusta los parámetros de caché según tus necesidades:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=hls_a:100m inactive=1h use_temp_path=off min_free=5g;
```

## Solución de Problemas
- **Error de conexión a Wasabi**: Verifica tus credenciales y la región configurada
- **Error de token inválido**: Asegúrate de que la clave secreta sea la misma en todos los componentes
- **Problemas de rendimiento**: Ajusta los parámetros de caché y el número de workers de Nginx

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue o un pull request para sugerir mejoras.

