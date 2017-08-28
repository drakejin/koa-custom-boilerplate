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

# For lambda deploy
Lambda Project is ${proj_path}/lambda 

 - Using apex
 - Refereces : https://blog.outsider.ne.kr/1241
 - Refereces : https://blog.outsider.ne.kr/1243
 - Refereces : https://airkjh.com/author/airkjh/
 - Github : https://github.com/apex/apex

``` bash
$ curl https://raw.githubusercontent.com/apex/apex/master/install.sh | sh
```

 - Tip: if you on lambda console, Ignore the message that **"이 함수는 외부 라이브러리를 포함하고 있습니다. 새 파일을 업로드하면 이 라이브러리가 재정의됩니다."**
  Don't nervous. It's a fake. This is bullshit.

# Run
  ```
  $ docker-compose up --build -d # production 운영 서비스 / 실제 운영 DB를 제어 하니 조심할것.
  $ docker-compose -f docker-compose.stg.yml up --build # staging 서버로 테스트
  $ docker-compose -f docker-compose.dev.yml up --bcd uild # development 로컬에서 구동.
  ```

