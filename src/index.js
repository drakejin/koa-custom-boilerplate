process.env.TZ = 'Asia/Seoul'

Object.defineProperty(global, '__stack', {
  get() {
    const orig = Error.prepareStackTrace
    Error.prepareStackTrace = (_, stack) => {
      return stack
    }
    const err = new Error()
    Error.captureStackTrace(err, arguments.callee)
    const stack = err.stack
    Error.prepareStackTrace = orig
    return stack
  },
})

Object.defineProperty(global, '__line', {
  get() {
    return __stack[1].getLineNumber()
  },
})

Object.defineProperty(global, '__function', {
  get() {
    return __stack[1].getFunctionName()
  },
})

const logger = require('lib/utils/logger')

logger.setSourceFunc(__filename, __function)
logger.silly(__line, '-----------------------------------------------')
logger.silly(__line, '---------- Connection pool for lambda -----------')
logger.silly(__line, '-----------------------------------------------')
logger.silly(__line, '-----------------   Startup   -----------------')
logger.silly(__line, '-----------------------------------------------')


// koa require
const Koa = require('koa')
const Router = require('koa-router')
const koaLogger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const onerror = require('koa-onerror')
const error = require('koa-json-error')

const api = require('api')

const app = new Koa()

const router = new Router()
router.use('/api', api.routes())

onerror(app, {
  accepts() {
    if (this.path.endsWith('.json')) return 'json'
    return 'html'
  },
})

app.use(koaLogger())
app.use(bodyParser({
  extendTypes: {
    json: ['application/x-javascript'],
  },
  onerror: async (ctx) => {
    ctx.throw(422, 'this server only use json ["application/x-javascript"]')
  },
}))
app.use(error((err) => {
  const response = {
    // Copy some attributes from
    // the original error
    status: err.status,
    message: err.message,
    // custom
    result: false,
    data: {},
  }
  // ctx.throw 를 통한 에러 반환.
  logger.warn(__line, response)
  return response
}))
app.use(router.routes())
app.use(router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = {
    data: ctx.body,
    result: true,
  }
  logger.info(__line, ctx.body)
  await next()
})

app.listen(4000, (err) => {
  if (err) logger.debug(__line, `error ${err.toString()}`)
  logger.debug(__line, 'this is koa server that\'s port is 4000')
})

process.on('exit', (code) => {
  logger.setSourceFunc(__filename, __function)
  logger.error(__line, `About to exit with code: ${code}`)
})
process.on('beforeExit', (code) => {
  logger.setSourceFunc(__filename, __function)
  logger.error(__line, `About to exit with code: ${code}`)
})
process.on('disconnect', (code) => {
  logger.setSourceFunc(__filename, __function)
  logger.error(__line, `About to exit with code: ${code}`)
})
process.on('uncaughtException', (err) => {
  logger.setSourceFunc(__filename, __function)
  logger.error(__line, `About to exit with code: ${err}`)
})
