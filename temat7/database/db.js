const assert = require('assert')
const MongoClient = require('mongodb').MongoClient

const url = "mongodb://root:root@mongo:27017/?authMechanism=DEFAULT"
const dbName = "GalleryDb"

MongoClient.connect(url, (err,client) => {
    assert.equal(null, err)
    console.log("Connected successfully to the server")

    const db = client.db(dbName)

    db.collection('Users').insertOne({
        name: "Grzegorz",
        last_name: "Kowalski"
    }, (err,result) => {
        if(err){
            console.log(err)
        } else {
            console.log("Everything is ok")
        }
    })

    setTimeout(() => {client.close()}, 1500)
})

