require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { application} = require('express')
//Models
const User = require('./models/User')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Passou daqui!!"
    })
})

app.post('/auth/register', async(req, res) =>{
    const {nome, email, senha, confirmarSenha} = req.body

    if(!nome){
        res.status(422).json({message: "Nescessario inserir um nome de usuario"})
        return
    }

    if(!email){
        res.status(422).json({message: "Nescessario inserir um email"})
        return
    }

    if(!senha){
        res.status(422).json({message: "Nescesarrio conter senha"})
        return
    }

    if(senha !== confirmarSenha){
        res.status(422).json({message: "As senhas precisam ser iguais"})
    }

    //Checar se o usuario ja existe
    const userExists = await User.findOne({ email: email })

    if(userExists){
        res.status(422).json({message:"Email ja cadastrado por favor inserir outro email"})
        return
    }

    //Criar senha
    const salt = await bcrypt.genSalt(12)
    const senhaHash = await bcrypt.hash(senha, salt)

    //Criar usuario
    const user = new User({
        nome,
        email,
        senha:senhaHash,

    })

    try {
        await user.save()

        res.status(201).json({message : "Usuario cadastrado com sucesso"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Ocorreu um erro no banco de dados"})
    }
})

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@apicluster.getuk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log("Conectou ao Banco")
}).catch((err) => console.log(err))