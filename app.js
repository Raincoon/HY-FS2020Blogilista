require('express-async-errors')
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/custom_middlewares')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')

//defining token for showing POST content
morgan.token('postData', (req) => { return JSON.stringify(req.body) })

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))
//token
app.use(middleware.tokenExtractor)


//routers
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
//errors
app.use(middleware.errorHandler)
//rest of the address space are 404s
app.use(middleware.unknownEndpoint)



module.exports = app