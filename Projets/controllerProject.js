const UserModel = require("../Authentication/user")
const { getUrlKeys } = require("../functions/getUrlKey")
const ProjetModel = require("./Projet")
const {S3Client, DeleteObjectsCommand} = require('@aws-sdk/client-s3')
require('dotenv').config()

const s3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

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
    const imagesUrl = images.map(elt => elt.location)
    if(!title || !department || !images || !description){
        return res.status(400).send('The fields are missing')
    }
    const newProject = new ProjetModel({...req.body, images:imagesUrl})
    await newProject.save()
    .then((value)=> res.status(200).send(value))
    .catch((err) => res.status(400).send(err))
}

const updateProject = async(req, res) => {
    const {title, department, description} = req.body
    const projectId = req.params.id
    const images = req.files
    const imagesUrl = images.map(elt => elt.location)
    if(!title || !department || !images || !description){
        return res.status(400).send('The fields are missing')
    }
    const project = await ProjetModel.findOne({_id:projectId})
    const arrKeys = getUrlKeys(project.images)
    const command = new DeleteObjectsCommand({
        Bucket:process.env.AWS_BUCKET,
        Delete:{
            Objects:arrKeys,
            Quiet:false
        }
    })
    await s3.send(command)
    await ProjetModel.findOneAndUpdate({_id:projectId}, {...req.body, images:imagesUrl})
    .then((value)=> res.status(200).send(value))
    .catch((err) => res.status(400).send(err))
}

const deleteProject = async(req, res) => { 
    try{
        const project = await ProjetModel.findOneAndDelete({_id:req.params.id})
        const arrKeys = getUrlKeys(project.images)
        const command = new DeleteObjectsCommand({
            Bucket:process.env.AWS_BUCKET,
            Delete:{
                Objects:arrKeys,
                Quiet:false
            }
        })
        await s3.send(command)
        res.status(200).send('The project is deleted')
    }
    catch(error){
        res.status(400).send(`An error occured, ${error}`)
    }
} 


module.exports = {getProjects, getUserProject, addProject, updateProject, deleteProject}