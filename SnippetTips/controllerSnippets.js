const UserModel = require("../Authentication/user")
const SnippetModel = require("./Snippet")
const fs = require('fs')

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
    const newSnippet = image? new SnippetModel({...req.body, image:image.path}) : new SnippetModel({...req.body})
    await newSnippet.save()
    .then(()=> res.status(200).send(`A new snippet added ${image}`))
    .catch((err) => res.status(400).send(err))
}

const updateSnippet = async(req, res) => {
    const {title, department, description} = req.body
    const image = req.file
    const snippetId = req.params.id
    if(!title || !department || !description){
        return res.status(400).send('The fields are missing')
    }
    await SnippetModel.findOneAndUpdate({_id:snippetId}, {...req.body, image:image.path})
    .then(()=> res.status(200).send('the snippet is updated'))
    .catch((err) => res.status(400).send(err))
}

const deleteSnippet = async(req, res) => { 
    try{
        const snippet =  await SnippetModel.findOneAndDelete({_id:req.params.id})
        const image = snippet.image
            fs.unlink(image, (err) => {
                if(err) return console.error(err)
                console.log(`the image is deleted.`)
                res.status(200).send('The snippet is deleted')
            })
        }
    catch(error){
        res.status(400).send(`An error occured, ${error}`)
    }
} 

const testImg = (req, res) => {
    try {
        const img = req.files
        if(!img) res.status(400).send('There is a missing field.')
        res.status(200).send(img)
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports = {getSnippets, getUserSnippets, addSnippet, updateSnippet, deleteSnippet, testImg}