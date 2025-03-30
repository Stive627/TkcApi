const UserModel = require("../Authentication/user")
const ProjetModel = require("./Projet")
const fs = require('fs')

const getProjects = async(req, res) => {
    try {
        const projects = await ProjetModel.find()
        res.status(200).send(projects)
    } catch (error) {
        res.status(400).send(error)
    }
}

const getUserProject = async(req, res) => {
    try {
        const email_user = req.params.email
        const projects = await UserModel.findOne({email:email_user}, 'projects')
        res.status(200).send(projects)
    } catch (error) {
        res.status(400).send(error)
    }
}

const addProject = async(req, res) => {
    const {title, category, description} = req.body
    const images = req.files
    const imagesUrl = images.map(elt => elt.path)
    if(!title || !category || !images || !description){
        return res.status(400).send('The fields are missing')
    }
    const newProject = new ProjetModel({...req.body, images:imagesUrl})
    await newProject.save()
    .then(()=> res.status(200).send('A new project added'))
    .catch((err) => res.status(400).send(err))
}

const updateProject = async(req, res) => {
    const {title, category, description} = req.body
    const projectId = req.params.id
    const images = req.files
    const imagesUrl = images.map(elt => elt.path)
    if(!title || !category || !images || !description){
        return res.status(400).send('The fields are missing')
    }
        await ProjetModel.findOneAndUpdate({_id:projectId}, {...req.body, images:imagesUrl})
        .then(()=> res.status(200).send('the project is updated'))
        .catch((err) => res.status(400).send(err))
}

const deleteProject = async(req, res) => { 
    try{
        const project =  await ProjetModel.findOneAndDelete({_id:req.params.id})
        const images = project.images
        for(var i = 0; i <= images.length; i++){
            fs.unlink(images[i], (err) => {
                if(err) return console.error(err)
                console.log(`the file no${i} is deleted.`)
            })
        }
    }
    catch(error){
        res.status(400).send(`An error occured, ${error}`)
    }
} 

module.exports = {getProjects, getUserProject, addProject, updateProject, deleteProject}