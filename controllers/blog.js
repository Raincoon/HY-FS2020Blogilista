const config = require('../utils/config')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// list all
blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

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

    // get logged-in user id
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    blog.user = user._id

    const added = await blog.save()

    user.blogs = user.blogs.concat(added._id)
    await User.findByIdAndUpdate(decodedToken.id, user)
    res.status(201).json(added.toJSON())
})

// edit
blogRouter.put('/:id', async (req, res) => {
    const newVer = req.body

    // get logged-in user id
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    newVer.user = user._id
    // find blog to edit
    const found = await Blog.findById(req.params.id)

    // if found and user is owner of blog, edit
    if (found) {
        const updated = await Blog.findByIdAndUpdate(req.params.id, newVer, { new: true })
        res.status(200).json(updated.toJSON)
    } else {
        res.status(404).end()
    }
})

// remove
blogRouter.delete('/:id', async (req, res) => {
    //const deleted = await Blog.findByIdAndRemove(req.params.id)

    // get logged-in user id
    const decodedToken = jwt.verify(req.token, config.SECRET)
    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    // find blog to remove
    const found = await Blog.findById(req.params.id)

    // if found and user is owner of blog, delete
    if (found) {
        if (found.user.toString() === user._id.toString()) {
            // TODO: need to delete the array entry on User's side as well
            await Blog.findByIdAndDelete(found._id)
            res.status(204).end()
        } else {
            res.status(401).json({ error: 'user not owner of entry' })
        }
    } else {
        res.status(404).end()
    }
})

module.exports = blogRouter