const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

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

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]


test('dummy returns 1', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {

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

describe('favorite blog', () => {

  test('of empty list is undefined', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, undefined)
  })

  test('when list has only one blog equals that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.strictEqual(result, listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.favoriteBlog(listWithThreeBlogs)
    assert.strictEqual(result, listWithThreeBlogs[1])
  })
})

describe('most blogs', () => {

  test('of empty list is undefined', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, undefined)
  })

  test('when list has only one blog equals that blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    assert.strictEqual(result.author, 'Edsger W. Dijkstra', 'Did not output the correct author')
    assert.strictEqual(result.blogs, 1, 'Did not output the correct number of blogs for the author')
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result.author, 'Robert C. Martin', 'Did not output the correct author')
    assert.strictEqual(result.blogs, 3, 'Did not output the correct number of blogs for the author')
  })
})