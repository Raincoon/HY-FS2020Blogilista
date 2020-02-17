const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./api_test_helper')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

describe('bloglist tests', () => {

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are listed', async () => {
        const res = await api.get('/api/blogs')

        expect(res.body.length).toBe(helper.initialBlogs.length)
    })

    test('blog id is not _id', async () => {
        const res = await api.get('/api/blogs/5a422a851b54a676234d17f7')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body.id).toBeDefined()
    })

    test('adding a valid blog entry works', async () => {
        const newBlog = {
            "_id": "5a422b891b54a676234d17fa",
            "title": "First class tests",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            "likes": 10,
            "__v": 0
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const numberOfBlogs = await helper.blogsInDb()
        expect(numberOfBlogs.length).toBe(helper.initialBlogs.length + 1)
        expect(numberOfBlogs.map(b => b.title)).toContain('First class tests')
    })

    test('adding non-valid blog returns 400', async () => {
        const newBlog = {
            "likes": 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const numberOfBlogs = await helper.blogsInDb()
        expect(numberOfBlogs.length).toBe(helper.initialBlogs.length)
    })

    test('deleting a blog works', async () => {
        await api
        .delete('/api/blogs/5a422b3a1b54a676234d17f9')
        .expect(204)

        const numberOfBlogs = await helper.blogsInDb()
        expect(numberOfBlogs.length).toBe(helper.initialBlogs.length - 1)
        expect(numberOfBlogs.map(b => b.id)).not.toContain('5a422b3a1b54a676234d17f9')
    })

    test('editing a blog entry works', async () => {
        const newBlog = {
            "_id": "5a422ba71b54a676234d17fb",
            "title": "TDD harms architecture",
            "author": "Robert C. Martin",
            "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            "likes": 20,
            "__v": 0
        }

        await api
            .put('/api/blogs/5a422ba71b54a676234d17fb')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)


        const editedBlog = await api.get('/api/blogs/5a422ba71b54a676234d17fb')
        expect(editedBlog.body.likes).toBe(20)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})