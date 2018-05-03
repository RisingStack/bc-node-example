const app = require('./server')
const metrics = require('./metrics')

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
