const express = require('express')
const axios = require('axios')
const routerGoogle = express.Router()
require('dotenv').config()

const REDIRECT_URI = 'https://tkcapi.tsasoft.com/auth/google/callback'
const frontend_Redirect = (email) => `https://tkcapi.tsasoft.com/finalRegister?email=${email}`

routerGoogle.get('/auth/google', (req, res)=>{
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
    res.redirect(url)
})

routerGoogle.get('/auth/google/callback', async(req, res)=>{
    const {code} = req.query
    try{ 
    const {data} = await axios.post('https://oauth2.googleapis.com/token', {
        client_id:process.env.CLIENT_ID,
        client_secret:process.env.CLIENT_SECRET,
        code,
        redirect_uri:REDIRECT_URI,
        grant_type:'authorization_code'
    })
    const {access_token, id_token} = data
    const {data:profile} = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo',{
        headers:{Authorization: `Bearer ${access_token}`}
    })
    console.log(profile)
    res.cookie('userInfo', JSON.stringify(profile), {maxAge:1000*60*60*24, httpOnly:true})
    res.redirect(frontend_Redirect(profile.email))
} catch(error){
console.error('Error:', error.response.data)
}
})


module.exports = routerGoogle