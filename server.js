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

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

const metricsServer = metrics.app.listen(metrics.port, () => {
  console.log(`Metrics app listening on port ${metrics.port}!`)
})

process.on('SIGTERM', async () => {
  console.log('recieved SIGTERM, stopping')

  routes.health.setUnready()
  console.log('Pod is set unready')

  clearInterval(metrics.collectionInterval)
  // hard coded timeout, should use readinessProbe * failureThreshold via kubernetes-client
  try {
    await sleep(1000)
    await server.close()
    console.log('server closed')
    await metricsServer.close()
    await mongoose.disconnect()
    console.log('disconnected from db')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
})

function sleep (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}
