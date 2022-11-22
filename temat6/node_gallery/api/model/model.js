const thinkagain = require('thinkagain')({host: "rethinkdb"});

let Gallery = thinkagain.createModel('Gallery', {
    type: 'object',
    properties: {
        id:{type:'string'},
        name:{type:'string'}
    }
})

let Image = thinkagain.createModel('Image', {
    type: 'object',
    properties: {
        id:{type:'string'},
        galleryId:{type:'string'},
        title:{type:'string'},
        description:{type:'string'},
        date:{type:'string',format:'date-time'},
        path:{type:'string'},
        size:{type:'integer'},
    },
    required: ['title', 'path']
})

Image.belongsTo(Gallery, 'gallery', 'galleryId', 'id');

exports.Image = Image;
exports.Gallery = Gallery;