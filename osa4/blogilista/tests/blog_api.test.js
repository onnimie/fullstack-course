const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const e = require('express')

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

  test('if POSTing a blog without \'likes\' field, likes should be set to 0', async () => {
    const blogToPost = {
      author: helper.testBlog.author,
      url: helper.testBlog.url,
      title: helper.testBlog.title
    }

    const res = await api.post('/api/blogs').send(blogToPost)
    const currentBlogs = await helper.blogsInDb()
    const b = currentBlogs.find(p => p.title === blogToPost.title && p.author === blogToPost.author && p.url === blogToPost.url)
    assert.strictEqual(b.likes, 0)
    assert.strictEqual(res.body.likes, 0)
  })

  test('if POSTing a blog without a \'title\' field or a \'url\' field, should respond with a 400 Bad Request, and the blogs should not be in the database', async () => {
    const blogToPostWithoutTitle = {
      author: helper.testBlog.author,
      url: helper.testBlog.url,
      likes: 10
    }
    const blogToPostWithoutURL = {
      author: helper.testBlog.author,
      title: helper.testBlog.title,
      likes: 9
    }

    const res1 = await api.post('/api/blogs')
      .send(blogToPostWithoutTitle)
      .expect(400)
    const res2 = await api.post('/api/blogs')
      .send(blogToPostWithoutURL)
      .expect(400)

    const currentBlogs = await helper.blogsInDb()
    const b1 = currentBlogs.find(p => p.url === blogToPostWithoutTitle.url && p.author === blogToPostWithoutTitle.author)
    const b2 = currentBlogs.find(p => p.title === blogToPostWithoutURL.title && p.author === blogToPostWithoutURL.author)

    assert.strictEqual(b1, undefined)
    assert.strictEqual(b2, undefined)
  })

  test('DELETE gives the correct responses for existing and missing id', async () => {
    const blogToDelete = helper.initialBlogs[2]

    const res1 = await api.delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)
    
    const missingId = await helper.nonExistingId()

    const res2 = await api.delete(`/api/blogs/${missingId}`)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(res2.error)
  })

  test('after DELETE, the blog is no longer in the database', async () => {
    const blogToDelete = helper.initialBlogs[3]

    await api.delete(`/api/blogs/${blogToDelete._id}`)

    const currentBlogs = await helper.blogsInDb()
    const b1 = currentBlogs.find(p => p.id === blogToDelete._id)

    assert.strictEqual(b1, undefined)
    assert.strictEqual(helper.initialBlogs.length-1, currentBlogs.length)
  })

  test('PUT gives the correct responses for existing and missing ids, and for sending incomplete data (missing fields)', async () => {
    const existingBlogToPut = helper.initialBlogs[2]
    const nonExistingId = await helper.nonExistingId()
    const newBlogToPut = helper.testBlog

    await api.put(`/api/blogs/${existingBlogToPut._id}`)
      .send(existingBlogToPut)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const res2 = await api.put(`/api/blogs/${nonExistingId}`)
      .send({newBlogToPut})
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const res3 = await api.put(`/api/blogs/${existingBlogToPut._id}`)
      .send({ blog: 'missing all relevant fields' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    assert(res2.error)
    assert(res3.error)
  })

  test('PUT updates the correct blog in the database', async () => {
    const i = 3
    const existingBlogToPut = { ...helper.initialBlogs[i] }
    existingBlogToPut.likes = existingBlogToPut.likes + 1
    existingBlogToPut.title = "NEW TITLE " + existingBlogToPut.title
    existingBlogToPut.url = "NEW URL " + existingBlogToPut.url
    existingBlogToPut.author = "NEW AUTHOR " + existingBlogToPut.author

    await api.put(`/api/blogs/${existingBlogToPut._id}`)
      .send(existingBlogToPut)
    
    const currentBlogs = await helper.blogsInDb()
    const updatedBlog = currentBlogs.find(p => p.id === existingBlogToPut._id)
    assert(updatedBlog)

    assert.notStrictEqual(updatedBlog.author, helper.initialBlogs[i].author)
    assert.notStrictEqual(updatedBlog.title, helper.initialBlogs[i].title)
    assert.notStrictEqual(updatedBlog.url, helper.initialBlogs[i].url)
    assert.notStrictEqual(updatedBlog.likes, helper.initialBlogs[i].likes)

    assert.strictEqual(helper.initialBlogs.length, currentBlogs.length)
  })

})


after(async () => {
  await mongoose.connection.close()
})