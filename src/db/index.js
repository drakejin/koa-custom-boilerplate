// const mysql = require('promise-mysql')
const mysql = require('koa-mysql')
const mysqlInfo = require('config/mysql')
const Promise = require('bluebird')
const logger = require('lib/utils/logger')



const pool = mysql.createPool(mysqlInfo[process.env.NODE_ENV])

pool.on('acquire', (connection) => {
  logger.setSourceFunc(__filename, __function)
  logger.debug(__line, `Connection ${connection.threadId} acquired `)
})

pool.on('connection', (connection) => {
  logger.setSourceFunc(__filename, __function)
  logger.debug(__line, `Connection ${connection.threadId} is success`)
})

pool.on('enqueue', (connection) => {
  logger.setSourceFunc(__filename, __function)
  logger.debug(__line, `Waiting for available connection(${connection.threadId} ) slot`)
})

pool.on('release', (connection) => {
  logger.setSourceFunc(__filename, __function)
  logger.debug(__line, `Connection ${connection.threadId} released`)
})


module.exports = {
  query(sql, params) {
    logger.setSourceFunc(__filename, __function)
    return new Promise((resolve, reject) => {
      pool.getConnection((e, c) => {
        if (e) reject(e)
        const conn = c
        const replaceReg = /[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi
        conn.config.queryFormat = (q, values) => {
          if (!values) return q
          const query = q.replace(replaceReg, ' ')
          return query.replace(/\:(\w+)/g, (key) => {
            if (values.hasOwnProperty(key)) return values[key].replace(replaceReg, '')
            return ''
          })
        }
        logger.debug(__function, __line, { sql, params })
        conn.query(sql, params, (e, r) => {
          if (e) reject(e)
          logger.debug(__function, __line, e || r)
          resolve(r)
        })
        conn.release()
      })
    })
  },
  pool,
}
