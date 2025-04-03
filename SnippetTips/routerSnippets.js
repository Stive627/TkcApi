const express = require('express')
const multer = require('multer')
const { getSnippets, getUserSnippets, addSnippet, updateSnippet, deleteSnippet, testImg } = require('./controllerSnippets')
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

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    const jwtsecretkey = process.env.jwtsecretkey
    if (typeof token !== 'undefined') {
      jwt.verify(token, jwtsecretkey, (err, authData) => {
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
const routerSnippets = express.Router()
routerSnippets.get('/', getSnippets)
routerSnippets.get('/:email',getUserSnippets)
routerSnippets.post('/add', upload.single('image'), addSnippet)
routerSnippets.put('/update/:id', upload.single('image'), updateSnippet)
routerSnippets.delete('/delete/:id',deleteSnippet)
routerSnippets.post('/testImg', upload.array('images', 10), testImg)
module.exports = routerSnippets