const express = require('express')
const { Register, emailVerification, login, connect, passwordRecovery, passwordChange, logout } = require('./controllerAuthentication')
const routerAuthentication = express.Router()

// Middleware to verify token

routerAuthentication.post('/register', Register)
routerAuthentication.post('/emailverification', emailVerification)
routerAuthentication.post('/login', login)
routerAuthentication.get('/connect', connect)
routerAuthentication.post('/passwordRecovery',passwordRecovery)
routerAuthentication.post('/passwordChange', passwordChange)
routerAuthentication.get('/logout', logout)

module.exports = routerAuthentication