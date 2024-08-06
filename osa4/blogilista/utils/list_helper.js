const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return undefined
    }

    let fav = blogs[0]
    blogs.forEach((b) => {
        if (b.likes > fav.likes) {
            fav = b
        }
    })
    return fav
    /*return {
        title: fav.title,
        author: fav.author,
        likes: fav.likes
    }*/
}

const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return undefined
    }

    let counts = _.countBy(blogs, 'author')
    let biggestBlogger = _.sortBy(_.toPairs(counts), p => -p[1])[0]
    return {
        author: biggestBlogger[0],
        blogs: biggestBlogger[1]
    }
}

const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return undefined
    }

    //console.log("INPUT:", blogs)
    let authorsAndLikes = blogs.map(b => [b.author, b.likes])
    //console.log("AUTHORS AND LIKES:", authorsAndLikes)
    let grouped = _.groupBy(authorsAndLikes, (h) => h[0])
    //console.log("GROUPED:", grouped)
    let pairs = _.toPairs(grouped)
    //console.log("PAIRS:", pairs)
    let mapped = pairs.map(g => [g[0],g[1].reduce((prev, curr) => prev + curr[1], 0)])
    //console.log("MAPPED & REDUCED:", mapped)
    let mostLiked = _.sortBy(mapped, p => -p[1])[0]
    //console.log("MOST LIKED:", mostLiked)

    return {
        author: mostLiked[0],
        likes: mostLiked[1]
    }
}

  
module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}