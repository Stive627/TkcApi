const express = require('express')
const { Register, emailVerification, login, connect, passwordRecovery, passwordChange } = require('./controllerAuthentication')
const routerAuthentication = express.Router()

routerAuthentication.post('/register', Register)
routerAuthentication.post('/emailverification', emailVerification)
routerAuthentication.post('/login', login)
routerAuthentication.get('/connect', connect)
routerAuthentication.post('/passwordRecovery',passwordRecovery)
routerAuthentication.post('/passwordChange', passwordChange)

module.exports = routerAuthentication