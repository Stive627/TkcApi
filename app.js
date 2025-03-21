const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.port || 8080
app.use(express.static("public"))
app.get('/', (req, res) => res.status(200).send('The Api is working well!'))
app.listen(port, ()=>console.log(`The server is running at http://localhost:${port}`))