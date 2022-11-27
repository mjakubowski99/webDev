const mongoose = require('mongoose')

const Schema = mongoose.Schema

let pictureSchema = new Schema({
    name: String,
    galleryId: String,
    title: String,
    description: String,
    date: Date,
    path: String,
    size: Number
})

const Picture = mongoose.model("Pictures", pictureSchema)

module.exports = Picture