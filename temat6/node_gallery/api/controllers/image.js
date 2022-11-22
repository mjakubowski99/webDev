'use strict';

var util = require('util');

module.exports = {
  listImages: listImages
};

var model =require('../model/model.js');

let gallery = model.Gallery({
    id: "123123-12331213",
    name: "Gallery 1"
})

let images = [
    model.Image({
        id: "0123456789abcd",
        galleryId: gallery.id,
        title: "Testowy obraz",
        description: "Opis do obrazka",
        date: "2017-11-09T10:20:00.214Z",
        path: "/library/images/",
        size: 1024
    })
];

function listImages(req, res, next){
    res.json(images);
}


