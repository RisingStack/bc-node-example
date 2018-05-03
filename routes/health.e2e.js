const expect = require('chai').expect
const server = require('supertest')
const mongoose = require('mongoose')
const _ = require('lodash/fp')
const app = require('../server')
const healthCheck = require('../routes').health

before(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1/Test')
})

describe('GET /health', function () {
  it('should send ok if connection is live', async function () {
    await server(app).get('/health').send().expect(200)
  })

  it('should send 500 if connection is broken', async function () {
    await mongoose.disconnect()
    await server(app).get('/health').send().expect(500)

    // reconnect to mongo after test
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1/Test')
  })

  it('should send 500 if pod is shutting down', async function () {
    healthCheck.setUnready()
    await server(app).get('/health').send().expect(500)
  })
})
