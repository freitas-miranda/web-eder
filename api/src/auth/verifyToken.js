// Importa o pacote jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = app => {

  // Função verify recebe o request e retorna o responsse da requisição
  const verify = async (req, res, next) => {
    try {
      console.log(`${req['headers'].host} - ${req.method} - ${req.url}`);

      // Obtem a token enviada
      const token = String(req['headers'].authorization).replace('Bearer ', '')

      // Verifica se a mesma é valida
      jwt.verify(token, process.env.APP_KEY);

      // Se for válida chama a proxima função
      next();
    } catch (error) {
      return res.status(401).send(error)
    }
  }

  return {
    verify
  }
}
