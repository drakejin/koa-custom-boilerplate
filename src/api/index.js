const Router = require('koa-router')

const pool = require('api/pool')

const api = new Router()
api.use('/pool', pool.routes())

module.exports = api
