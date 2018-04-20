const userModel = require('../models').user

async function post (req, res) {
  try {
    await userModel.add(req.body)
  } catch (err) {
    if (err.code === 11000) {
      return res.sendStatus(400)
    }
  }
  return res.send()
}

async function get (req, res) {
  try {
    const user = await userModel.findById(req.params.id)
  } catch (err) {
    return res.sendStatus(500)
  }

  if (!user) {
    return res.sendStatus(404)
  }

  return res.json(user)
}

async function del (req, res) {
  try {
    const removedUser = await userModel.remove(req.params.id)
  } catch (err) {
    return res.sendStatus(500)
  }

  if (!user) {
    return res.sendStatus(404)
  }

  return res.send()
}
