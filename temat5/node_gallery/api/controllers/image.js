'use strict';

var util = require('util');

module.exports = {
  listImages: listImages,
  readImage: readImage,
  updateImage: updateImage,
  deleteImage: deleteImage
};

let image = {
    id: "0123456789abcd",
    title: "Testowy obrazek",
    description: "Opis do obrazka",
    date: "2017-11-09T10:20:00.214Z",
    path: "/library/images/",
    size: 1024
};

let images = [image];

function listImages(req, res, next){
    res.json(images);
}

function readImage(req, res, next){
    let image = images.find( el => el.id === req.params.id );
    res.json(image);
}

function updateImage(req, res, next){
    let image = images.find( el => el.id === req.params.id );
    image.title = req.params.title
    image.description = req.params.descritpion
    res.json(image);
}

function deleteImage(req, res, next){
    let image = images.find( el => el.id === req.params.id );
    res.json();
}



