const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  let blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }
  
  const res = await blog.save()
  response.status(201).json(res)
})


module.exports = blogsRouter