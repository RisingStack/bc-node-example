const _ = require('lodash')
const metrics = require('./metrics')
const express = require('express')

const app = express()
const port = process.env.PORT || 3001

app.use(metrics.middleware.recordResponseTime)

app.get('/', (req, res, next) => {
  setTimeout(() => {
    res.json({ message: 'Hello World!' })
    next()
  }, Math.round(Math.random() * 200))
})

app.use(metrics.middleware.recordMetrics)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

metrics.app.listen(metrics.port, () => {
  console.log(`Metrics app listening on port ${port}!`)
})

process.on('SIGTERM', () => {
  clearInterval(metrics.collectionInterval)
  process.exit(0)
})
