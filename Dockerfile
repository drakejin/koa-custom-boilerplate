FROM node:8.4.0

ENV TZ Asia/Seoul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /node

COPY aws ~/.aws
COPY . /node
RUN cd /node
RUN cp -R /node/aws ~/.aws
RUN npm install -g yarn pm2

EXPOSE 4000 80