const mongoose = require('mongoose')
const {Schema} = mongoose

const SnippetSchema = new Schema({
    title:{type:String, required:true, unique:true},
    description:{type:String, required:true},
    category:{type:String, required:true},
    image:{type:String, required:true},
}, 
{timestamps:true})
const SnippetModel = mongoose.model('SnippetsTips', SnippetSchema)
module.exports = SnippetModel