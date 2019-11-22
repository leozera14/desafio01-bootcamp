const express = require('express');

const server = express();

server.use(express.json());

server.use(logRequests);

let requisicoes = 0;

const projetos = [];

function logRequests(req, res, next) {
  requisicoes++;

  console.log(`Numero de requisições: ${requisicoes}`);

  return next();
}

function verificaProjetos(req, res, next) {
  const { id } = req.params;
  const projeto = projetos.find(p => p.id == id);

  if(!projeto) {
    return res.status(400).json({  error: 'Não existe nenhum projeto com este id.' });
  }

  return next();
}

function verificaBodyRequest(req, res, next) {
  if(!req.body.id) {
    return res.status(400).json({ error: 'Por favor, informe o ID do projeto' });
  }

  if(!req.body.title) {
    return res.status(400).json({ error: 'Por favor, informe o Titulo do projeto' });
  }

  return next();
}

server.get('/projetos', (req, res) => {
  return res.json(projetos);
})


server.post('/projetos', verificaBodyRequest, (req, res) => {
  const { id, title } = req.body;

  const projeto = {
    id,
    title,
    tasks: []
  };

  projetos.push(projeto);

  return res.json(projeto);
});


server.put('/projetos/:id', verificaProjetos, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);

  projeto.title = title;

  return res.json(projeto);
});


server.delete('/projetos/:id', verificaProjetos, (req, res) => {
  const { id } = req.params;
  
  const ProjetoID = projetos.findIndex(p => p.id == id);

  projetos.splice(ProjetoID, 1);

  return res.send('Projeto excluido com sucesso.');
});


server.post('/projetos/:id/tasks', verificaProjetos, (req, res) => {
  const { id } = req.params;

  const { title } = req.body;

  const projeto = projetos.find(p => p.id == id);

  projeto.tasks.push(title);

  return res.json(projeto);
});


server.listen(4000);
