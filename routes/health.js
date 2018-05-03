const express = require('express')
const mongo = require('../models').db
const HEALTH_TIMEOUT = 1000

const state = {
  isShuttingDown: false
}

function setUnready () {
  state.isShuttingDown = true
}

function get (req, res, next) {
  if (state.isShuttingDown) {
    console.log('Shutting down, failing readiness probe on purpose')
    res.sendStatus(500)
    return next()
  }

  promiseTimeout(mongo.db.admin().ping, HEALTH_TIMEOUT)
    .then(() => {
      res.sendStatus(200)
      next()
    })
    .catch(err => {
      console.error('Mongo error', err)
      res.sendStatus(500)
      next()
    })
}

function promiseTimeout (originalPromise, timeout) {
  return Promise.race([
    Promise.resolve(originalPromise),
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Timed out'))
      }, timeout)
    })
  ])
}

module.exports = {
  setUnready,
  get
}
