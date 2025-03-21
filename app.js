const express = require('express')
require('dotenv').config()
const app = express()
const port = process.env.port || 8080
app.use(express.static("public"))
app.listen(port, ()=>console.log(`The server is running at http://localhost:${port}`))