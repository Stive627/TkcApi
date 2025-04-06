const mongoose = require('mongoose')
const {Schema} = mongoose

const SnippetSchema = new Schema({
    title:{type:String, required:true, unique:false},
    description:{type:String, required:true},
    department:{type:String, required:true},
    image:{type:String},
}, 
{timestamps:true})
const SnippetModel = mongoose.model('SnippetsTips', SnippetSchema)
module.exports = SnippetModel