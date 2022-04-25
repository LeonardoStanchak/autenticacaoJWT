const mongoose = require('mongoose');

const User = mongoose.model('User', {
    nome: String,
    email: String,
    senha: String,
    confirmarSenha: String
})

module.exports = User;