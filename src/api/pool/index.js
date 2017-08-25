const Router = require('koa-router')
const db = require('db')
const utils = require('lib/utils')
const logger = require('lib/utils/logger')

const connectionRouter = new Router()

connectionRouter.post('/', async (ctx, next) => {
  logger.setSourceFunc(__filename, __function)
  logger.debug(__line, ctx.request.body)
  logger.debug(__line, ctx.request.headers)

  const sql = utils.nullCheck(ctx.request.body.sql)
  const params = utils.nullCheck(ctx.request.body.params)

  logger.info(__line, sql)
  logger.info(__line, params)

  if (!params || !sql) {
    ctx.throw(400, `check you parameter value in "${JSON.stringify({ sql, params })}" `)
  }
  try {
    const result = await db.query(sql, params)
    ctx.body = result
  } catch (e) {
    ctx.throw(500, e)
  }
  await next()
})

module.exports = connectionRouter
