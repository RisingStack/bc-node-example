const express = require('express')
const _ = require('lodash')

const app = express()
const Prometheus = require('prom-client')

const port = process.env.METRICS_PORT || 9999

const collectionInterval = Prometheus.collectDefaultMetrics()
const httpRequestsTotal = new Prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'code', 'method']
})
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route']
})

app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

const middleware = {
  recordResponseTime (req, res, next) {
    res.locals.startEpoch = Date.now()
    return next()
  },

  recordMetrics (req, res, next) {
    const responseTimeInMs = Date.now() - res.locals.startEpoch

    httpRequestsTotal.inc({
      route: req.path,
      code: res.statusCode,
      method: req.method
    })
    httpRequestDurationMicroseconds.labels(req.path).observe(responseTimeInMs)

    return next()
  }
}

module.exports = {
  middleware,
  app,
  port,
  collectionInterval
}
