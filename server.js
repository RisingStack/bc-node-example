const _ = require('lodash')
const metrics = require('./metrics')
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes')
const mongoose = require('mongoose')

const app = express()
const port = process.env.PORT || 3001

app.use(bodyParser.json())
app.use(metrics.middleware.recordResponseTime)

app.get('/', (req, res, next) => {
  res.send(app._router.stack)
  next()
})

app.post('/user', routes.user.post)
app.get('/user', routes.user.get)
app.get('/user/:id', routes.user.getById)
app.delete('/user/:id', routes.user.del)

app.get('/health', routes.health.get)

app.get('*', (req, res, next) => {
  if (res.headersSent) {
    return next()
  }

  res.sendStatus(404)
  return next()
})

app.use(metrics.middleware.recordMetrics)

module.exports = app
