const express = require('express')
const multer = require('multer')
const { getSnippets, getUserSnippets, addSnippet, updateSnippet, deleteSnippet, testImg} = require('./controllerSnippets')
const {S3Client} = require('@aws-sdk/client-s3')
const multerS3 = require('multer-s3')
require('dotenv').config()

const s3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

const storage = multerS3({
    s3:s3,
    bucket:process.env.AWS_BUCKET,
    metadata:function(req, file, cb){
        cb(null, {fieldName:file.fieldname})
    },
    key:function(req, file, cb){
        const fileName = Date.now()+ '-' + file.originalname;
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage});

const routerSnippets = express.Router()
routerSnippets.get('/', getSnippets)
routerSnippets.get('/:email',getUserSnippets)
routerSnippets.post('/add', upload.single('image'), addSnippet)
routerSnippets.put('/update/:id', upload.single('image'), updateSnippet)
routerSnippets.delete('/delete/:id',deleteSnippet)
module.exports = routerSnippets