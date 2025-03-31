const mongoose = require('mongoose')
const {Schema} = mongoose

const UserSchema = new Schema({
    username:{type:String,},
    email:{type:String, required:true,unique:true},
    password: {type:String, required:true},
    snippets:[{type:Schema.Types.ObjectId, ref:'SnippetsTips'}],
    projects:[{type:Schema.Types.ObjectId, ref:'Projects'}]
}, 
{timestamps:true})
const UserModel = mongoose.model('Users', UserSchema)
module.exports = UserModel