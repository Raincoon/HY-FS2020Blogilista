require('../models/blog')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const countlikes = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.length === 0 ?
        0
        : blogs.reduce(countlikes, 0)
}

const favouriteBlog = (blogs) => {
    let fav = blogs[0] || {}
    blogs.forEach(b => {

        b.likes >= fav.likes ?
            fav = b
            : fav
    });

    return  fav === {}?
    {}
    : {
        title:fav.title,
        author:fav.author,
        likes:fav.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}