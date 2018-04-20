const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
mongoose.Promise = global.Promise

const db = mongoose.connection

db.on('error', err => console.error('Connection error', err))
db.on('open', () => console.log('Connected to db'))

module.exports(db)
