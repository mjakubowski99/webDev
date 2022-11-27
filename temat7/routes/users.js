const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const User = require('../database/models/user')

const url = "mongodb://root:root@mongo:27017?authMechanism=DEFAULT"

mongoose.connect(url)

router.get('/', async (req, res) => {
    const users = await User.find({})

    const results = users.map((user) => {
        return {
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            age: user.age
        }
    })

    return res.send(results)
})

router.post('/', async (req, res) => {
    const user = req.body

    const userToSave = new User({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        age: user.age
    })
    userToSave.save()

    return res.send(await User.find({}))
})

module.exports = router