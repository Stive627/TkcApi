const UserModel = require("../Authentication/user")
const { getUrlKey } = require("../functions/getUrlKey")
const SnippetModel = require("./Snippet")
const {S3Client, DeleteObjectCommand} = require('@aws-sdk/client-s3')
require('dotenv').config()

const s3 = new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
})

const getSnippets = async(req, res) => {
    try {
        const snippets = await SnippetModel.find()
        res.status(200).send(snippets)
    } catch (error) {
        res.status(400).send(error)
    }
}

const getUserSnippets = async(req, res) => {
    try {
        const email = req.params.email
        const user = await UserModel.findOne({email:email})
        const snippetUser = user.snippets
        res.status(200).send(snippetUser)
    } catch (error) {
        res.status(400).send(error)
    }
}

const addSnippet = async(req, res) => {
    const {title, department, description} = req.body
    const image = req.file
    if(!title || !department || !description){
        return res.status(400).send('The fields are missing')
    }
    const newSnippet = new SnippetModel({...req.body, image:image?.location})
    await newSnippet.save()
    .then((value)=> res.status(200).send(value))
    .catch((err) => res.status(400).send(err))
}

const updateSnippet = async(req, res) => {
    const {title, department, description} = req.body
    const image = req.file
    const snippetId = req.params.id
    if(!title || !department || !description){
        return res.status(400).send('The fields are missing')
    }
    const snippet = await SnippetModel.findOne({_id:snippetId})
    const key = getUrlKey(snippet.image)
    const command = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET,
            Key:decodeURI(key)
        })
        await s3.send(command)
    await SnippetModel.findOneAndUpdate({_id:snippetId}, {...req.body, image:image?.location})
    .then((value)=> res.status(200).send(value))
    .catch((err) => res.status(400).send(err))

}

const deleteSnippet = async(req, res) => { 
    try{
        const snippet = await SnippetModel.findOneAndDelete({_id:req.params.id})
        const key = getUrlKey(snippet.image)
        const command = new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET,
            Key:decodeURI(key)
        })
        await s3.send(command)
        res.status(200).send('The snippet is deleted')
    }
    catch(error){
        res.status(400).send(`An error occured, ${error}`)
    }
} 

module.exports = {getSnippets, getUserSnippets, addSnippet, updateSnippet, deleteSnippet}