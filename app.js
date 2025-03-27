const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
const port = process.env.port || 8080
const uri = process.env.uri
app.use(express.static("public"))
app.get('/', (req, res) => res.status(200).send('The Api is working well!'))
mongoose.connect(uri, {dbName:'TKC'}).then(()=>console.log('Connected to the database')).catch(err => console.error(err))
app.listen(port, ()=>console.log(`The server is running at http://localhost:${port}`))