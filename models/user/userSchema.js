require('../connection')

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
})

UserModel.findById = function (id) {
  return UserModel.findOne({ _id: id })
}

UserModel.add = async function (newUser) {
  return new UserModel(newUser).save()
}

UserModel.remove = function (id) {
  return UserModel.findOneAndRemove({ _id: id })
}

module.exports = UserModel
