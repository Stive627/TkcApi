const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const bodyParser = require('body-parser')
const routerAuthentication = require('./Authentication/routerAuthentication')
const routerSnippets = require('./SnippetTips/routerSnippets')
const routerProject = require('./Projets/routerProject')
const routerGoogle = require('./Authentication/GoogleAuth')
require('dotenv').config()
const app = express()
const port = process.env.port || 8080
const uri = process.env.uri
app.use(cors({
    origin: ['https://tkc.tsasoft.com', 'http://localhost:3000'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true 
  }));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get('/', (req, res) => res.status(200).send('The Api is working well!'))
app.use('/snippet', routerSnippets)
app.use('/project', routerProject)
app.get('/setcookie', (req, res) => {
    res.cookie('userinfo', JSON.stringify({name:'stive', uid:'24MCI10053'}), {maxAge:1000*60*60*24*30, httpOnly:true})
    res.status(200).send('Cookie sent')
})
app.get('/deletecookie', (req, res) =>{
    res.clearCookie('logininfo')
    res.end('cookie cleared')

})
app.get('/getcookie', (req, res) => res.status(200).send(req.cookies.logininfo))
app.get('/beforeRedirect', (req, res) => res.redirect(`/?email=fossistive627@gmail.com&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`))
app.use('/user', routerAuthentication)
app.use('/', routerGoogle)
mongoose.connect(uri, {dbName:'TKC'}).then(()=>console.log('Connected to the database')).catch(err => console.error(err))
app.listen(port, ()=>console.log(`The server is running at http://localhost:${port}`))