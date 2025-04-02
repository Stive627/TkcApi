const bcrypt = require('bcryptjs')
const tmail = require('./tmail')
const UserModel = require('./user')
require('dotenv').config()

const Register = async(req, res) => {
    const {username, email, password} = req.body
    if(!username || !email || !password){ 
        return res.status(400).send('The field(s) are missing.')
    }
    if(username.length < 4){
        return res.status(400).send('The username should contains more than 4 characters.')
    }
    if(!/^[^@]+@gmail.com/.test(email) || /^[^@]+/.exec(email)[0].length < 8){
        return res.status(400).send('The email is invalid')
    }
    if(password.length < 5 || !/\d/.test(password)) {
        return res.status(400).send('The password is not valid.')
    }
    const user = await UserModel.findOne({$or:[{username:username}, {email:email}]})
    if(user){
        return res.status(400).send('The user already exist.')
    }
    const cryptPass =  await bcrypt.hash(password, 5)
    const newAdmin = new UserModel({username:username, email:email, password:cryptPass})
    await newAdmin.save()
    .catch((error)=>res.status(400).send(error))
    await tmail('tsasoft7@gmail.com', 'oyxmklwkwivrovia', email, `welcome in TKC, ${username}`, "<h1 style='color:'blue'>TKC is a notes application that allows us to save important notes and tips that we discover during our daily work.</h1>")
    .then((value) => {
        console.log(value.response);
        res.cookie('logininfo', JSON.stringify({nameoremail:email, password:password}), {maxAge:1000*60*60*24*30, httpOnly:true, SameSite:'None'})
        return res.redirect(`https://tkc.tsasoft.com/?email=${email}`)})
    .catch((error) => console.log('An error occured while sending message', error))
}

const login = async (req, res) => {
    const {usernameoremail, password} = req.body
    if(!usernameoremail || !password) return res.status(400).send('some fields are missing')
    const user = await UserModel.findOne({$or:[{username:usernameoremail}, {email:usernameoremail}]}).catch((error)=>res.status(400).send(error))
    if(!user) return res.status(400).send('Invalid credentials. Please double check and enter. the correct credentials')
    const goodPassowrd = await bcrypt.compare(password, user.password).catch((error)=>res.status(400).send(error))
    if(goodPassowrd){
        res.cookie('logininfo',JSON.stringify({nameoremail:usernameoremail, password:password}), {maxAge:1000*60*60*24*30, httpOnly:true, SameSite:'None'})
        return res.redirect(`https://tkc.tsasoft.com/${usernameoremail}`)  
    }
    res.status(400).send('Invalid credentials. Please double check and enter. the correct credentials')
}

const emailVerification = async (req, res) => {
    const {email} = req.body
    const code = Math.floor(Math.random()*(199999 - 100000) + 100000)
    const codeString = String(code).slice(0, 3) + ' ' + String(code).slice(3)
    await tmail('tsasoft7@gmail.com', 'oyxmklwkwivrovia', email, 'Here is the code to verify your email address', `<h2>Your verification code </h2><h1>${codeString}</h1>`)
    .then((value)=>res.send({message:value.response, code:code}))
    .catch((error)=>res.status(400).send(error))
}

const passwordRecovery = async (req, res) =>{
    const {email} = req.body
    const code = Math.floor(Math.random()*(199999 - 100000) + 100000)
    const codeString = String(code).slice(0, 3) + ' ' + String(code).slice(3)
    await tmail('tsasoft7@gmail.com', 'oyxmklwkwivrovia', email, 'Here is the code to change your password', `<h2>Your verification code</h2><h1>${codeString}</h1>`)
    .then((value)=>res.send({message:value.response, code:code}))
    .catch((error)=>res.status(400).send(error))

}

const passwordChange = async (req, res) => {
    const {email, password} = req.body
    const cryptPass =  await bcrypt.hash(password, 5)
    if(!email || !password) return res.send('The values fields are missing.')
    await UserModel.updateOne({email:req.body.email}, {password:cryptPass})
    .then(()=>res.send('Password successfully changed.'))
    .catch((reason)=>res.send(`An error occured. \nThe reason is ${reason}`)) 
}

const connect = (req, res) => {
    const cook = req.cookies.logininfo
    try {
        if(!cook){
            return res.status(200).send({authenticated:false})
        }
        return res.status(200).send({authenticated:true, data: JSON.parse(cook)})
    
    } catch (error) {
       res.status(400).send(error) 
    }
   }

const logout = (req, res) => {
    try {
        res.clearCookie('logininfo')
        res.end('cookie deleted')
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {Register, login, emailVerification, passwordChange, passwordRecovery, passwordRecovery, connect, logout}