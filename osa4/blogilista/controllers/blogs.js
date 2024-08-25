const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  let blog = new Blog(request.body)
  if (!blog.likes) {
    blog.likes = 0
  }

  if (!blog.url || !blog.title) {

    return response.status(400).json({
      error: 'Missing fields (url or title)'
    })
  }

  const user = await User.findById(decodedToken.id)
  blog.user = user._id

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
  
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

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedBlog = request.body

  const idExists = await Blog.exists({_id: id})

  if (idExists === null) {
    response.status(400).json({
      error: 'Cannot update non-existing id'
  })}
  else if (!updatedBlog.author || !updatedBlog.url || !updatedBlog.title || !updatedBlog.likes) {
    response.status(400).json({
      error: 'Missing fields (author, url, title or likes)'
    })
  }
  else {

    const blog = {
      title: updatedBlog.title,
      author: updatedBlog.author,
      url: updatedBlog.url,
      likes: updatedBlog.likes
    }

    const res = await Blog.findByIdAndUpdate(id, blog, { new: true })
    response.status(200).json(res)
  }
})


module.exports = blogsRouter