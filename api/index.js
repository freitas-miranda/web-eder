// Importação de pacotes
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const consign = require('consign')
const knex = require('knex')
const config = require('./src/config/db')

// instanciação da varíavel global app
const app  = express()

app.use(cors())
app.use(bodyParser.json())

// Carregamento da configuração do banco de dados
const database = knex(config)
app.db = database

// Carregamento dos arquivos para a variavel global app.
consign()
.include('./src/controller')
.include('./src/auth')
.include('./src/router')
.into(app)

// Inicialização do serviço
app.listen(process.env.APP_PORT, () => {
  console.log(`Rodando na porta ${process.env.APP_PORT}`)
})
