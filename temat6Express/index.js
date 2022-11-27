
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users.js')

app.use(bodyParser.json())

app.use('/users', userRoutes)

app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
