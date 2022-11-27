
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')

const mongoose = require('mongoose')
const Picture = require('./models/picture')

const url = "mongodb://root:root@mongo:27017?authMechanism=DEFAULT"

mongoose.connect(url, {
  dbName: "Gallery"
})

app.use(bodyParser.json())

app.get('/galleries', async (req,res) => {
  return res.send(await Gallery.find())
})

app.get('/images', async (req,res)=>{
    return res.send(await Picture.find())
})

app.post('/images', async (req,res)=>{
  const data = req.body;

  const picture = new Picture({
    name: data.name,
    title: data.title,
    description: data.description,
    path: data.path,
    date: data.date,
    size: data.size 
  })

  await picture.save()

  return res.send(picture)
})

app.get('/images/:id', async (req,res)=>{
  const {id} = req.params

  const picture = await Picture.findById(id)

  return res.send(picture)
})

app.put('/images/:id', async (req,res)=>{
  const {id} = req.params
  const data = req.body

  const picture = await Picture.findById(id)

  picture.name = data.name
  picture.title = data.title
  picture.description = data.description
  picture.path = data.path
  picture.date = data.date
  picture.size = picture.size

  await picture.save()

  return res.send(picture)
})

app.delete('/images/:id', async (req,res)=>{
  const {id} = req.params

  const picture = await Picture.findByIdAndDelete(id)

  return res.send(picture)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
