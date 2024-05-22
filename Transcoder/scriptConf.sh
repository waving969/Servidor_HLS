apt update && apt install build-essential git libpcre3-dev libssl-dev zlib1g-dev ffmpeg libxml2-dev 

wget http://nginx.org/download/nginx-1.22.1.tar.gz

tar -zxvf nginx-1.22.1.tar.gz

wget https://github.com/kaltura/nginx-vod-module/archive/refs/tags/1.31.tar.gz

tar -zxvf 1.31.tar.gz

wget https://github.com/kaltura/nginx-aws-auth-module/archive/refs/tags/1.1.tar.gz

tar -zxvf 1.1.tar.gz

wget https://github.com/kaltura/nginx-secure-token-module/archive/refs/tags/1.5.tar.gz

tar -zxvf 1.5.tar.gz

cd nginx-1.22.1

./configure \
    --prefix=/etc/nginx \
    --conf-path=/etc/nginx/nginx.conf \
    --error-log-path=/var/log/nginx/error.log \
    --http-log-path=/var/log/nginx/access.log \
    --pid-path=/run/nginx.pid \
    --sbin-path=/usr/sbin/nginx \
    --with-http_secure_link_module \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_stub_status_module \
    --with-http_realip_module \
    --with-file-aio \
    --with-http_mp4_module \
    --with-http_slice_module \
    --with-threads \
    --with-stream \
    --with-cc-opt="-O3 -mpopcnt" \
    --add-module=../nginx-vod-module-1.31 \
    --add-module=../nginx-aws-auth-module-1.1 \
    --add-module=../nginx-secure-token-module-1.5

make && make install

mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old

