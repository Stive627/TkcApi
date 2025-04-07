const UserModel = require("../Authentication/user")
const ProjetModel = require("./Projet")

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
    const {title, department, description} = req.body
    const images = req.files
    const imagesUrl = images.map(elt => elt.path)
    if(!title || !department || !images || !description){
        return res.status(400).send('The fields are missing')
    }
    const newProject = new ProjetModel({...req.body, images:imagesUrl})
    await newProject.save()
    .then(()=> res.status(200).send('A new project added'))
    .catch((err) => res.status(400).send(err))
}

const updateProject = async(req, res) => {
    const {title, department, description} = req.body
    const projectId = req.params.id
    const images = req.files
    const imagesUrl = images.map(elt => elt.path)
    if(!title || !department || !images || !description){
        return res.status(400).send('The fields are missing')
    }
        await ProjetModel.findOneAndUpdate({_id:projectId}, {...req.body, images:imagesUrl})
        .then(()=> res.status(200).send('the project is updated'))
        .catch((err) => res.status(400).send(err))
}

const deleteProject = async(req, res) => { 
    try{
        await ProjetModel.findOneAndDelete({_id:req.params.id})
        .then(()=> res.status(200).send('The project is deleted'))
        .catch(err => res.status(400).send(err))

    }
    catch(error){
        res.status(400).send(`An error occured, ${error}`)
    }
} 
const testSomething = (req, res) => {
    try {
        const images = req.files
        const imagesUrl = images.map(elt => elt.path)
        res.status(200).send(imagesUrl)
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {getProjects, getUserProject, addProject, updateProject, deleteProject, testSomething}