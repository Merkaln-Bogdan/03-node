const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const {promises: fsPromises} = require('fs');
const express = require('express')
const { Router } = require('express');
const imageRouter = Router();
const multer = require('multer');
const path = require('path')


const storage = multer.diskStorage({
    destination: 'tmp',
    filename: function (req, file, cb) {
        console.log('file', file)
        const ext = path.parse(file.originalname).ext
        cb(null, Date.now() + ext);
    }
});
const upload = multer({storage})

imageRouter.use(express.static(`${__dirname}/../public/images`))

async function minifyImage(req, res, next) {
console.log("req" , req.file)
    const MINIFIED_DIR = 'public/images';

    await imagemin(['tmp/*.{jpg,png}'], {
        destination: MINIFIED_DIR,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
 
    const {filename, path: draftPath} = req.file;
    await fsPromises.unlink(draftPath)
    req.file = {
        ...req.file,
        path: path.join(MINIFIED_DIR,filename),
        destination: MINIFIED_DIR
    }
}


module.exports = {imageRouter, upload, minifyImage}