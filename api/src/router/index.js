const jwt = require('jsonwebtoken');

module.exports = app => {
  // rota post /login recebe a função que está em:
  // app -> variavel global
  // src.auth -> pastas onde o arquivo login.js está
  // login.login -> arquivo login e função login dentro do mesmo

  app.post('/login', app.src.auth.login.login)

  // Toda rota que for criada antes desse * nao requer token válida
  app.all('*', app.src.auth.verifyToken.verify)

  app.get('/produto', app.src.controller.produto.listar)
  app.get('/produto/:id', app.src.controller.produto.exibir)
  app.put('/produto/:id', app.src.controller.produto.editar)
  app.post('/produto', app.src.controller.produto.salvar)
  app.delete('/produto/:id', app.src.controller.produto.deletar)

}
