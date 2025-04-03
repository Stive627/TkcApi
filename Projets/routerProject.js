const express = require('express')
const { getProjects, getUserProject, addProject, updateProject, deleteProject } = require('./controllerProject')
const multer = require('multer')
const routerProject = express.Router()
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'public/snippets/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    } 
})

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (typeof token !== 'undefined') {
      jwt.verify(token, secretKey, (err, authData) => {
        if (err) {
          res.sendStatus(403).send('error token');
        } else {
          req.authData = authData;
          next();
        }
      });
    } else {
      res.sendStatus(401).send('No token');
    }
}
const upload = multer({storage:storage})
routerProject.get('/', getProjects)
routerProject.get('/userproject/:email',getUserProject)
routerProject.post('/add', upload.array('images', 15), addProject)
routerProject.put('/update/:id', upload.array('images', 15), updateProject)
routerProject.delete('/delete/:id', deleteProject)
module.exports = routerProject