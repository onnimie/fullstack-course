const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
})


describe('user api tests', () => {

    test("Cannot POST user with short username or password", async () => {
        const goodUsername = "GoodUsername"
        const goodPassword = "GoodPassword"
        const badUsername = ""
        const badPassword = "b"

        const u1 = {
            username: goodUsername,
            name: goodUsername,
            password: badPassword
        }

        const u2 = {
            username: badUsername,
            name: badUsername,
            password: goodPassword
        }

        const res1 = await api.post("/api/users")
            .send(u1)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const res2 = await api.post("/api/users")
            .send(u2)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert(res1.error, "response contains error field")
        assert(res2.error, "response contains error field")
    })

})


after(async () => {
  await mongoose.connection.close()
})