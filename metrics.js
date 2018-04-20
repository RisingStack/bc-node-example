const express = require('express')
const _ = require('lodash')

const metricsApp = express()
const Prometheus = require('prom-client')

const port = process.env.METRICS_PORT || 9999

const collectionInterval = Prometheus.collectDefaultMetrics()
const httpRequestsTotal = new Prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'code']
})
const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route']
})

metricsApp.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType)
  res.end(Prometheus.register.metrics())
})

const middleware = {
  recordResponseTime (req, res, next) {
    res.locals.startEpoch = Date.now()
    next()
  },

  recordMetrics (req, res, next) {
    const responseTimeInMs = Date.now() - res.locals.startEpoch
    const path = _.get(req, 'route.path') || req.path

    httpRequestsTotal.inc({ route: path, code: res.statusCode })
    httpRequestDurationMicroseconds.labels(path).observe(responseTimeInMs)

    next()
  }
}

module.exports = {
  middleware,
  app,
  port,
  collectionInterval
}
