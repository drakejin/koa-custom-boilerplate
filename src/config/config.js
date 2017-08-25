const moment = require('moment-timezone')

module.exports = {
  staging: {
    whiteList: [],
    logger: {
      timestamp: () => { return moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss:SSS') },
      dirname: `${__dirname}/../../logs`,
      filename: 'log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'silly',
      silent: false,
      colorize: true,
      formatter(options) {
        // Return string will be passed to logger.
        return `${options.timestamp()} ${options.level.toUpperCase()} ${options.message ? options.message : ''
        }${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
      },
    },
  },
  production: {
    whiteList: [],
    logger: {
      timestamp: () => { return moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss:SSS') },
      dirname: `${__dirname}/../../logs`,
      filename: 'log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'info',
      silent: false,
      colorize: true,
      formatter(options) {
        // Return string will be passed to logger.
        return `${options.timestamp()} ${options.level.toUpperCase()} ${options.message ? options.message : ''
        }${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
      },
    },
  },
  development: {
    whiteList: ['::1'],
    logger: {
      timestamp: () => { return moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss:SSS') },
      dirname: `${__dirname}/../../logs`,
      filename: 'log',
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      level: 'silly',
      silent: false,
      colorize: true,
      formatter(options) {
        // Return string will be passed to logger.
        return `${options.timestamp()} ${options.level.toUpperCase()} ${options.message ? options.message : ''
        }${options.meta && Object.keys(options.meta).length ? `\n\t${JSON.stringify(options.meta)}` : ''}`
      },
    },
  },
}

/*
:logger setting : winston-daily-rotate-file 

  this.json = options.json !== false;
  this.colorize = options.colorize || false;
  this.maxsize = options.maxsize || null;
  this.logstash = options.logstash || null;
  this.maxFiles = options.maxFiles || null;
  this.label = options.label || null;
  this.prettyPrint = options.prettyPrint || false;
  this.showLevel = options.showLevel === undefined ? true : options.showLevel;
  this.timestamp = options.timestamp === undefined ? true : options.timestamp;
  this.datePattern = options.datePattern ? options.datePattern : '.yyyy-MM-dd';
  this.depth = options.depth || null;
  this.eol = options.eol || os.EOL;
  this.maxRetries = options.maxRetries || 2;
  this.prepend = options.prepend || false;
  this.localTime = options.localTime || false;
  this.zippedArchive = options.zippedArchive || false;

  */
