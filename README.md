# DB Connection For Lambda

# libraries
  - koa for async processing
  - winston for logging
    - https://github.com/winstonjs/winston#streaming-logs
  - aws-sdk
  - bluebird for Promise
  - eslint 

# Envrionment
 1. AWS lambda (ver nodejs 6.10)
 2. DynamoDB
    - cp -R aws ~/.aws
 3. managing for Mysql DB Connection
    
# requirements

  ```
    $ cp -R aws ~/.aws
    $ npm install -g eslint-cli yarn pm2
    $ yarn install
  ```

# Run
  ```
  $ docker-compose up --build -d # production 운영 서비스 / 실제 운영 DB를 제어 하니 조심할것.
  $ docker-compose -f docker-compose.stg.yml up --build # staging 서버로 테스트
  $ docker-compose -f docker-compose.dev.yml up --build # development 로컬에서 구동.
  ```
