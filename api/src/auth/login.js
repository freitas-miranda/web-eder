var jwt = require('jsonwebtoken'); // Importação do pacote jsonwebtoken
const validate = require('validate.js') // Importação do pacote validate.js

// Exportação do módlo para ser acessado de forma externa recebendo app como parametro
module.exports = app => {
  const validarUsuario = {
    email: { presence: true, email: true },
    senha: { presence: true, type: 'string' }
  }

  // Função login recebe o request da requisição e retorna o response
  const login = async (req, res) => {
    try {
      // Valida se o usuário informou o login e a senha
      const err = validate(req.body, validarUsuario)
      if (err) return res.json(err)

      // Pesquisa o usuário pelo login e senha no banco de dados na tabela usuario
      const user = await app.db('usuario')
      .where({
        email: req.body.email,
        senha: req.body.senha
      }).first()
      if (!user) return res.json({ erro: "Usuário ou senha inválidos!" })

      // Utiliza o pacote jsonwebtoken instaciado na variavel jwt
      // para gerar a token que possui informações do usuário e data de expiração para uso da token
      const token = jwt.sign({
        data: {
          name: user.nome,
          email: user.email
        }
        // Utiliza APP_KEY do arquivo .env para criptografar as informações com expiração de 1 hora
      }, process.env.APP_KEY, { expiresIn: '1h' });

      // Retorna a token com as informações e os dados do usuário logado como nome e email.
      return res.json({
        token,
        payload: {
          name: user.nome,
          email: user.email
        }
      })
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  // Exporta a função login para ser acessada de forma externa pelo arquivo de rotas.
  return {
    login
  }
}
