// Importamos o pacote validate.js para validar campos obrigatórios de preenchimento
const validate = require('validate.js')

// Exportamos o módulo recebendo como parâmetro a variavel global app
module.exports = app => {

  // variavel com a validação de campos obrigatórios para salvar
  const validarCampos = {
    descricao: { presence: true, type: 'string' },
    quantidade: { presence: true, type: 'number' },
    valor: { presence: true, type: 'number' }
  }

  // Função listar é asincrona e recebe request e retorna uma responsse
  const listar = async (req, res) => {
    try {
      // Constante que obtem a lista de produtos no banco
      // app.db é a variavel de conexao com o banco de dados configurado no index.js
      const resp = await app.db('produto').select()

      // retornoda função listar retorna a variavel resp com a lista de produtos do banco de dados
      return res.json(resp)
    } catch (error) {
      // caso ocorrer algum erro, uma menssagem de erro será retornada
      return res.json({ erro: error.message })
    }
  }

  // Função exibir é assincrona e recebe a requisição e retorna uma resposta
  const exibir = async (req, res) => {
    try {
      // A diferença é que nesse caso deve retornar um produto caso o id seja correspondente ao informado na requisição.
      const resp = await app.db('produto')
      .where({
        id: req.params.id
      })
      .select()

      // Retorna o primeiro resultado encontrado.
      return res.json(resp[0])
    } catch (error) {
      // Caso ocorra alguma falha, retorna um erro
      return res.json({ erro: error.message })
    }
  }

  // Função editar
  const editar = async (req, res) => {
    try {
      // Valida com a variavel validate se todos os campos obrigatórios foram passados no req.body
      const err = validate(req.body, validarCampos)
      // Caso não retorna uma menssagem de erro
      if (err) return res.json(err)

      const { id } = req.params;

      // Ao tentar editar um produto. Verifica se o mesmo existe na base de dados
      const findOne = await app.db('produto')
      .where({
        id
      })
      if (!findOne.length) throw new Error('Produto não encontrado')

      // Caso exista então aplica um update para atualizar as informações
      await app.db('produto')
        .where({
          id
        })
        .update({
          descricao: req.body.descricao,
          quantidade: req.body.quantidade,
          valor: req.body.valor
        })

      return res.json({ message: 'Alterado' })
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  const salvar = async (req, res) => {
    try {
      const err = validate(req.body, validarCampos)
      if (err) return res.json(err)

      await app.db('produto')
        .insert({
          descricao: req.body.descricao,
          quantidade: req.body.quantidade,
          valor: req.body.valor
        })

      return res.json({ message: 'Inserido' })
    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  const deletar = async (req, res) => {
    try {
      const { id } = req.params;

      const findOne = await app.db('produto')
        .where({
          id
        })
        if (!findOne.length) throw new Error('Produto não encontrado')

      await app.db('produto')
        .where({
          id
        })
        .del()

      return res.json({ message: 'Deletado' })

    } catch (error) {
      return res.json({ erro: error.message })
    }
  }

  // Para ser acessadas de outros arquivos todas as funçoes devem ser exportadas.
  return {
    listar,
    exibir,
    editar,
    salvar,
    deletar
  }
}
