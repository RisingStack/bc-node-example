const userModel = require('../models').user

async function post (req, res, next) {
  try {
    await userModel.add(req.body)
  } catch (err) {
    if (err.code === 11000) {
      res.sendStatus(400)
      return next()
    }
  }
  res.send()
  return next()
}

async function get (req, res, next) {
  let user
  try {
    user = await userModel.findAll()
  } catch (err) {
    res.sendStatus(500)
    return next()
  }

  // per REST it should send 409 - conflict
  // sends 404 here to better demonstrate Prometheus monitoring
  if (!user) {
    res.sendStatus(404)
    return next()
  }

  res.json(user)
  return next()
}

async function getById (req, res, next) {
  let user
  try {
    user = await userModel.findById(req.params.id)
  } catch (err) {
    res.sendStatus(500)
    return next()
  }

  if (!user) {
    res.sendStatus(404)
    return next()
  }

  res.json(user)
  return next()
}

async function del (req, res, next) {
  let removedUser
  try {
    removedUser = await userModel.remove(req.params.id)
  } catch (err) {
    res.sendStatus(500)
    return next()
  }

  // per REST it should send an ok answer to provide an idempotent contract
  // sends 404 here to better demonstrate Prometheus monitoring
  if (!removedUser) {
    res.sendStatus(404)
    return next()
  }

  res.send()
  return next()
}

module.exports = {
  post,
  getById,
  get,
  del
}
