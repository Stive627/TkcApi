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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],          
  allowedHeaders: ['Content-Type', 'Authorization'],          
  optionsSuccessStatus: 200                              
}));
app.options('*', cors());
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.get('/', (req, res) => res.status(200).send('The Api is working well!'))
app.get('/setcookie', (req, res) => res.cookie('userinfo', JSON.stringify({name:'stive', uid:'24MCI10053', email:'fossistive627@gmail.com'}), {maxAge:1000*60*60*24*30, httpOnly:true, secure:true, sameSite:'none'}))
app.get('/getcookie', (req, res) => {
  const userinfo = req.cookies.userinfo
  if(userinfo){
    return res.status(200).send(JSON.parse(userinfo))
  }
  return res.status(400).send('No cookie set')
})
app.use('/snippet', routerSnippets)
app.use('/project', routerProject)
app.use('/user', routerAuthentication)
app.use('/', routerGoogle)
mongoose.connect(uri, {dbName:'TKC'}).then(()=>console.log('Connected to the database')).catch(err => console.error(err))
app.listen(port, ()=>console.log(`The server is running at http://localhost:${port}`))