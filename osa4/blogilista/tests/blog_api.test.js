const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('blog api tests', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('returned blogs have a field \'id\'', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]
    assert(firstBlog.id)
  })

  test('POSTing a blog gives the correct response', async () => {
    const response = await api.post('/api/blogs')
        .send(helper.testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const postedBlog = response.body
    assert.strictEqual(postedBlog.title, helper.testBlog.title)
    assert.strictEqual(postedBlog.author, helper.testBlog.author)
  })

  test('after POSTing a blog, number of blogs in database should be 1 higher, and the posted blog should be in the database', async () => {
    const response = await api.post('/api/blogs').send(helper.testBlog)
    const postedBlog = response.body

    const currentBlogs = await helper.blogsInDb()
    assert.strictEqual(helper.initialBlogs.length+1, currentBlogs.length)
    assert(currentBlogs.map(b => b.title).includes(postedBlog.title))
  })

})


after(async () => {
  await mongoose.connection.close()
})