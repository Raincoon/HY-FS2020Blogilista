const blogRouter = require('express').Router()
const Blog = require('../models/blog')

// list all
blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})

    res.json(blogs)
})

// list one
blogRouter.get('/:id', async (req, res) => {
    const found = await Blog.findById(req.params.id)

    found ?
        res.json(found.toJSON())
        : res.status(404).end()
})

// add new
blogRouter.post('/', async (req, res) => {
    const blog = new Blog(req.body)

    const added = await blog.save()
    res.status(201).json(added.toJSON())
})

// edit
blogRouter.put('/:id', async (req, res) => {
    const newVer = new Blog(req.body)

    const edited = await Blog.findByIdAndUpdate(req.params.id, newVer, { new: true })

    edited ?
    res.json(edited.toJSON)
    : res.status(404).end()
})

// remove
blogRouter.delete('/:id', async (req, res) => {
    const deleted = await Blog.findByIdAndRemove(req.params.id)

    deleted ?
        res.status(204).end()
        : res.status(404).end()
})

module.exports = blogRouter