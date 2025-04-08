const express = require('express')
const multer = require('multer')
const { getSnippets, getUserSnippets, addSnippet, updateSnippet, deleteSnippet, testImg} = require('./controllerSnippets')
require('dotenv').config()
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'public/snippets/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    } 
})
const upload = multer({storage:storage})

const routerSnippets = express.Router()
routerSnippets.get('/', getSnippets)
routerSnippets.get('/:email',getUserSnippets)
routerSnippets.post('/add', upload.single('image'), addSnippet)
routerSnippets.put('/update/:id', upload.single('image'), updateSnippet)
routerSnippets.delete('/delete/:id',deleteSnippet)
routerSnippets.post('/testImg', upload.array('images', 10), testImg)
module.exports = routerSnippets