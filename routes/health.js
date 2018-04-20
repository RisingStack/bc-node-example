const express = require('express')
const mongo = require('../models').db

const HEALTH_TIMEOUT = 1000

function get (req, res) {
  promiseTimeout(mongo.db.admin().ping, HEALTH_TIMEOUT)
    .then(() => res.sendStatus(200))
    .catch(err => {
      console.error('Mongo error', err)
      res.sendStatus(500)
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
