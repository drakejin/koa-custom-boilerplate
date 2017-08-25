const winston = require('winston')
require('winston-daily-rotate-file')

const moment = require('moment-timezone')
const path = require('path')
const config = require('config/config')[process.env.NODE_ENV]

const dynamoConfig = require('config/dynamo')[process.env.NODE_ENV]
const AWS = require('aws-sdk')

AWS.config.credential = {
  accessKeyId: dynamoConfig.accessKeyId,
  secretAccessKey: dynamoConfig.secretAccessKey,
}
AWS.config.region = dynamoConfig.region

const docClient = new AWS.DynamoDB.DocumentClient()

const dailyRotateFile = new winston.transports.DailyRotateFile(config.logger)
const winstonConsole = new winston.transports.Console(config.logger)

const logger = new (winston.Logger)({
  transports: [
    dailyRotateFile,
    winstonConsole,
  ],
})

module.exports = (() => {
  let source
  let func
  function sendDynamo(level, l, msg, meta) {
    levels = { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

    if (levels[level] > levels[config.logger.level]) return

    docClient.put({
      TableName: dynamoConfig.tableName,
      Item: {
        timestamp: moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss:SSS'), which: 'connection-pool-for-lambda', source, func, line: l, level, message: msg, meta,
      },
    }, (err) => { if (err) console.log(err) })
  }

  return {
    setSourceFunc: (s, f) => {
      source = path.basename(s)
      func = f
    },
    // request and response information
    info: (l, msg, meta) => {
      logger.info({ which: 'connection-pool-for-lambda', source, func, line: l, message: msg, meta })
      sendDynamo('info', l, msg, meta)
    },
    // system operation 
    debug: (l, msg, meta) => {
      sendDynamo('debug', l, msg, meta)
      logger.debug({ which: 'connection-pool-for-lambda', source, func, line: l, message: msg, meta })
    },
    // critical message in harmful event 
    error: (l, msg, meta) => {
      sendDynamo('error', l, msg, meta)
      logger.error({ which: 'connection-pool-for-lambda', source, func, line: l, message: msg, meta })
    },
    // logical error on REST url
    warn: (l, msg, meta) => {
      sendDynamo('warn', l, msg, meta)
      logger.warn({ which: 'connection-pool-for-lambda', source, func, line: l, message: msg, meta })
    },
    // just using local
    silly: (l, msg, meta) => {
      logger.silly({ which: 'connection-pool-for-lambda', source, func, line: l, message: msg, meta })
    },
  }
})()
