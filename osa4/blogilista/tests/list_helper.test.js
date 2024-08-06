const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns 1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithThreeBlogs = [
    {
      _id: '11111aa71b54a676234d1111',
      title: 'Title1',
      author: 'Author1',
      url: 'http://localhost/test1',
      likes: 1,
      __v: 0
    },
    {
      _id: '22222aa71b54a676234d2222',
      title: 'Title2',
      author: 'Author2',
      url: 'http://localhost/test2',
      likes: 3,
      __v: 0
    },
    {
      _id: '33333aa71b54a676234d3333',
      title: 'Title3',
      author: 'Author3',
      url: 'http://localhost/test3',
      likes: 2,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithThreeBlogs)
    assert.strictEqual(result, 6)
  })
})