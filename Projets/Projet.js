const mongoose = require('mongoose')
const {Schema} = mongoose

const ProjetSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    department:{type:String, required:true},
    images:{type:[String], required:true},
}, 
{timestamps:true})
const ProjetModel = mongoose.model('Projets', ProjetSchema)
module.exports = ProjetModel