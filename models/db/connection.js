const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1/Test')
mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', err => console.error('Connection error', err))
db.on('open', () => console.log('Connected to db'))

module.exports = db
