require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI
if (process.env.NODE_ENV === 'test') {
    MONGODB_URI = process.env.TEST_MONGODB_URI
}

let SECRET = process.env.SECRET
let TEST_TOKEN = process.env.TEST_TOKEN

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    TEST_TOKEN
}