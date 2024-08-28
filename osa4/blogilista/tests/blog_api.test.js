const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const e = require('express')

let userId_1 = null
let userToken_1 = null
let userId_2 = null
let userToken_2 = null
let userBlogs_1 = []
let userBlogs_2 = []

beforeEach(async () => {

  await User.deleteMany({})
  const createUserResponse1 = await api.post('/api/users').send(helper.initialUser1)
  userId_1 = createUserResponse1.body.id
  const loginResponse1 = await api.post('/api/login').send({ username: helper.initialUser1.username, password: helper.initialUser1.password })
  //console.log(loginResponse1.body)
  userToken_1 = loginResponse1.body.token

  const createUserResponse2 = await api.post('/api/users').send(helper.initialUser2)
  userId_2 = createUserResponse2.body.id
  const loginResponse2 = await api.post('/api/login').send({ username: helper.initialUser2.username, password: helper.initialUser2.password })
  userToken_2 = loginResponse2.body.token

  const blogs_for_user1 = [helper.initialBlogs.shift()]
  const blogs_for_user2 = helper.initialBlogs

  blogs_for_user1.forEach(async (b) => {
    b.user = userId_1
    await User.findByIdAndUpdate(userId_1, { blogs: userBlogs_1.concat(b._id) })
    userBlogs_1 = userBlogs_1.concat(b._id)
  })
  blogs_for_user2.forEach(async (b) => {
    b.user = userId_2
    await User.findByIdAndUpdate(userId_2, { blogs: userBlogs_2.concat(b._id) })
    userBlogs_2 = userBlogs_2.concat(b._id)
  })

  await Blog.deleteMany({})
  await Blog.insertMany(blogs_for_user1)
  await Blog.insertMany(blogs_for_user2)

  helper.initialBlogs = blogs_for_user1.concat(blogs_for_user2)
})


describe('blog api tests', () => {

  test('blogs are returned as json', async () => {
    //console.log(userToken_1)
    await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('returned blogs have a field \'id\'', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
    const firstBlog = response.body[0]
    assert(firstBlog.id)
  })

  test('POSTing a blog gives the correct response when the auth token is missing (and the blog is not added)', async () => {
    const res1 = await api
      .post('/api/blogs')
      .send(helper.testBlog)
      .expect(401)

    const currentBlogs = await helper.blogsInDb()
    const b1 = currentBlogs.find(p => p.url === helper.testBlog.url && p.author === helper.testBlog.author && p.title === helper.testBlog.title)

    assert.strictEqual(b1, undefined)
  })

  test('POSTing a blog gives the correct response when authorized with a token', async () => {
    const response = await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer '+ userToken_1)
        .send(helper.testBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const postedBlog = response.body
    assert.strictEqual(postedBlog.title, helper.testBlog.title)
    assert.strictEqual(postedBlog.author, helper.testBlog.author)
  })

  test('after POSTing a blog, number of blogs in database should be 1 higher, and the posted blog should be in the database', async () => {
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
      .send(helper.testBlog)
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

    const res = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
      .send(blogToPost)
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

    const res1 = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
      .send(blogToPostWithoutTitle)
      .expect(400)
    const res2 = await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer '+ userToken_1)
      .send(blogToPostWithoutURL)
      .expect(400)

    const currentBlogs = await helper.blogsInDb()
    const b1 = currentBlogs.find(p => p.url === blogToPostWithoutTitle.url && p.author === blogToPostWithoutTitle.author)
    const b2 = currentBlogs.find(p => p.title === blogToPostWithoutURL.title && p.author === blogToPostWithoutURL.author)

    assert.strictEqual(b1, undefined)
    assert.strictEqual(b2, undefined)
  })

  test('DELETE gives the correct responses for existing and missing id', async () => {
    const blogToDeleteId = userBlogs_1[0]
    const res1 = await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set('Authorization', 'Bearer '+ userToken_1)
      .expect(204)
    
    const missingId = await helper.nonExistingId()

    const res2 = await api
      .delete(`/api/blogs/${missingId}`)
      .set('Authorization', 'Bearer '+ userToken_2)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(res2.error)
  })

  test('after DELETE, the blog is no longer in the database', async () => {
    const blogToDeleteId = userBlogs_2[2]

    await api
      .delete(`/api/blogs/${blogToDeleteId}`)
      .set('Authorization', 'Bearer '+ userToken_2)

    const currentBlogs = await helper.blogsInDb()
    const b1 = currentBlogs.find(p => p.id === blogToDeleteId)

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