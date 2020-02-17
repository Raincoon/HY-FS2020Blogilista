const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

// list all
userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })

    res.json(users)
})

// list one
userRouter.get('/:id', async (req, res) => {
    const found = await User.findById(req.params.id)

    found ?
        res.json(found.toJSON())
        : res.status(404).end()
})

// add new
userRouter.post('/', async (req, res) => {
    const body = req.body

    if (body.username === undefined || body.password.length < 3) {
        res.status(400).json({
            error: 'need a username and a password longer than 3 characters'
        }).end()
    }

    const passwordHash = await bcrypt.hash(body.password, 12)

    const user = new User({
        blogs:[],
        username: body.username,
        name: body.name,
        passwordHash
    })

    const added = await user.save()
    res.status(201).json(added.toJSON())
})

module.exports = userRouter