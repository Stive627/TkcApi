const express = require('express')
const { getProjects, getUserProject, addProject, updateProject, deleteProject, testSomething } = require('./controllerProject')
const multer = require('multer')
const routerProject = express.Router()
require('dotenv').config()
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'public/Projects/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    } 
})

const upload = multer({storage:storage})
routerProject.get('/', getProjects)
routerProject.get('/userproject/:email',getUserProject)
routerProject.post('/add', upload.array('images', 15), addProject)
routerProject.put('/update/:id', upload.array('images', 15), updateProject)
routerProject.delete('/delete/:id', deleteProject)
routerProject.post('/test', upload.array('images', 14), testSomething)
module.exports = routerProject