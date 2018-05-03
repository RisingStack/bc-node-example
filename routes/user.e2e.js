const expect = require('chai').expect
const server = require('supertest')
const mongoose = require('mongoose')
const _ = require('lodash/fp')
const app = require('../server')
const UserModel = require('../models').user

afterEach(async function () {
  await UserModel.deleteMany({})
})

after(async function () {
  await mongoose.disconnect()
})

describe('POST /user', function () {
  it('should save new user sent in body', async function () {
    const body = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    await server(app).post('/user').send(body).expect(200)

    const users = await UserModel.find({})

    expect(users.length).to.eql(1)
    expect(_.omit(['__v', '_id'], users[0].toObject())).to.eql(body)
  })

  it('should send 400 if user already exists', async function () {
    const body = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    await UserModel.add(body)

    await server(app).post('/user').send(body).expect(400)

    const users = await UserModel.find({})

    expect(users.length).to.eql(1)
    expect(_.omit(['__v', '_id'], users[0].toObject())).to.eql(body)
  })
})

describe('GET /user/', function () {
  it('should get all registered users', async function () {
    const firstBody = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    const secondBody = {
      email: 'testtest@mail.com',
      username: 'testtest',
      firstName: 'Wonder',
      lastName: 'Woman'
    }

    await server(app).post('/user').send(firstBody).expect(200)
    await server(app).post('/user').send(secondBody).expect(200)
    await server(app).get('/user').send().expect(res => {
      expect(res.status).to.eql(200)
      const returnedUsers = _.map(_.omit(['__v', '_id']), res.body)
      expect(returnedUsers.length).to.eql(2)
      expect(returnedUsers).to.deep.have.members([firstBody, secondBody])
    })
  })
})

describe('GET /user/:id', function () {
  it('should get selected user', async function () {
    const firstBody = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    const secondBody = {
      email: 'testtest@mail.com',
      username: 'testtest',
      firstName: 'Wonder',
      lastName: 'Woman'
    }

    const { _id: firstId } = await UserModel.add(firstBody)
    await UserModel.add(secondBody)

    await server(app).get(`/user/${firstId}`).send().expect(res => {
      expect(res.status).to.eql(200)
      const returnedUser = _.omit(['__v', '_id'], res.body)
      expect(returnedUser).to.eql(firstBody)
    })
  })

  it('shoud send 404 if user does not exist', async function () {
    const invalidId = '1aaa000aa000aaaa0a0a0000'
    const body = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    await UserModel.add(body)

    await server(app).get(`/user/${invalidId}`).send().expect(404)
  })
})

describe('DELETE /user/:id', function () {
  it('should delete selected user', async function () {
    const firstBody = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    const secondBody = {
      email: 'testtest@mail.com',
      username: 'testtest',
      firstName: 'Wonder',
      lastName: 'Woman'
    }

    const { _id: firstId } = await UserModel.add(firstBody)
    await UserModel.add(secondBody)

    await server(app).delete(`/user/${firstId}`).send().expect(200)
    await server(app).get(`/user/`).send().expect(res => {
      expect(res.status).to.eql(200)
      const returnedUsers = _.map(_.omit(['__v', '_id']), res.body)
      expect(returnedUsers.length).to.eql(1)
      expect(returnedUsers[0]).to.eql(secondBody)
    })
  })

  it('should send 404 if user does not exit', async function () {
    const invalidId = '1aaa000aa000aaaa0a0a0000'
    const body = {
      email: 'test@mail.com',
      username: 'test',
      firstName: 'Bat',
      lastName: 'Man'
    }

    await UserModel.add(body)

    await server(app).delete(`/user/${invalidId}`).send().expect(404)

    await server(app).get(`/user/`).send().expect(res => {
      expect(res.status).to.eql(200)
      const returnedUsers = _.map(_.omit(['__v', '_id']), res.body)
      expect(returnedUsers.length).to.eql(1)
      expect(returnedUsers[0]).to.eql(body)
    })
  })
})
