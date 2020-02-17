const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

const listOfBlogs = [
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
const listWithOneBlog = [
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    }
]

describe('total likes', () => {

    test('on an empty list', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('on a list of size 1', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(10)
    })

    test('on a list of size > 1', () => {
        expect(listHelper.totalLikes(listOfBlogs)).toBe(36)
    })
})
describe('favourite Blog', () => {

    const listWithNoLikes = [
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 0,
            __v: 0
        }
    ]

    test('returns empty on no blogs', () => {
        expect(listHelper.favouriteBlog([])).toEqual({})
    })
    test('returns a blog on list of size 1', () => {
        expect(listHelper.favouriteBlog(listWithOneBlog)).toEqual(
            {
                title: "First class tests",
                author: "Robert C. Martin",
                likes: 10
            })
    })
    test('returns the blog with most likes in a list', () => {
        expect(listHelper.favouriteBlog(listOfBlogs)).toEqual(
            {
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                likes: 12
            })
    })
    test('returns a blog even if most likes is 0', () => {
        expect(listHelper.favouriteBlog(listWithNoLikes)).toEqual(
            {
                title: "First class tests",
                author: "Robert C. Martin",
                likes: 0
            })
    })
})