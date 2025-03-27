const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true},
    password: {type:String, required:true},
}, 
{timestamps:true})
const UserModel = mongoose.model('Users', UserSchema)
module.exports = UserModel