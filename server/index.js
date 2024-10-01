const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const pinRoute = require('./routes/pins')
const userRoute = require('./routes/user')
const cors = require('cors')
app.use(express.json())
app.use(cors())
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true}).then(() => {
    console.log('mONGO DB CONNECTED')
})

//useNewUrlParser is user so that we can also use the old parser if the queries are written in that format.
.catch((error) => {
    console.log(error.message)
})

app.use("/api/pins", pinRoute)
app.use("/api/users", userRoute)

app.listen(3002, () => {
    console.log('listening to port 30002')
})