const metrics = require('../metrics')
const mongoose = require('mongoose')

after(async function () {
  clearInterval(metrics.collectionInterval)
  await mongoose.disconnect()
  process.exit(0)
})
