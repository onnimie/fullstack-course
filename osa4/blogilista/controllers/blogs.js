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

  if (!blog.url || !blog.title) {

    response.status(400).json({
      error: 'Missing fields (url or title)'
    })
  } else {

    const res = await blog.save()
    response.status(201).json(res)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const idExists = await Blog.exists({_id: id})

  if (idExists === null) {
    response.status(400).json({
      error: 'Cannot delete non-existing id'
    })
  } else {
    await Blog.findByIdAndDelete(id)
    response.status(204).end()
  }
})


module.exports = blogsRouter