FROM nginx

# 모든 컨테이너 같은 타임존을 위해 / 시간동기화를 의미하지는 않는다.
ENV TZ Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


COPY nginx.conf /etc/nginx/conf.d/default.conf
