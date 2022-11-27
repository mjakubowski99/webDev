const mongoose = require('mongoose')

const Schema = mongoose.Schema

let userSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    age: Number
})

const User = mongoose.model("users", userSchema)

module.exports = User