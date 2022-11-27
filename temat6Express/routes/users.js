const { v4: uuidv4 } = require('uuid');
const express = require('express')

const router = express.Router()

const users = [
    {
        id: uuidv4(),
        name: "Jan",
        last_name: "Kowalski",
        email: "jan.kowalski@wp.pl",
        age: 22
    },
    {
        id: uuidv4(),
        name: "Grzegorz",
        last_name: "Kowalski",
        email: "grzegorz.kowalski@wp.pl",
        age: 23
    },
]

router.get('/', (req, res) => {
    res.send(users)
})

router.post('/', (req, res) => {
    const user = req.body;
    users.push({
        id: uuidv4(),
        name: user.name,
        last_name: user.last_name,
        age: user.age
    })
    return res.send(users)
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    
    return res.send(users.find( user => user.id === id))
})

router.put('/:id', (req, res) => {
    const {id} = req.params;
    const user = req.body;

    const index = users.findIndex(user => user.id === id)

    users[index] = {
        id: users[index].id,
        name: user.name,
        last_name: user.last_name,
        age: user.age
    }
    
    return res.send(users[index])
})

router.delete('/:id', (req,res) => {
    const {id} = req.params;

    const index = users.findIndex(user => user.id === id)

    if( index > -1 ){
        users.splice(index, 1)
    }

    return res.send(users)
})

module.exports = router