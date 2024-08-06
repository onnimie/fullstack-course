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
  
module.exports = {
  dummy, totalLikes, favoriteBlog
}