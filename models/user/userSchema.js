require('../db/connection')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})

const UserModel = mongoose.model('users', userSchema)

UserModel.findAll = function () {
  return UserModel.find({})
}

// We rseuse findById from mongoose. Create the funciont when migrating to other DB

UserModel.add = async function (newUser) {
  return new UserModel(newUser).save()
}

UserModel.remove = function (id) {
  return UserModel.findByIdAndRemove(id)
}

module.exports = UserModel
