const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

let numberOfRequest = 0;

server.use((req, res, next) => {
  numberOfRequest ++;
  console.log(`Quantidade de requisições: ${numberOfRequest}`);

  return next();
})

function checkIdExits(req, res, next) {
  const { id } = req.params;

  const project = projects.find(proj => proj.id == id )

  if(!project) {
    return res.status(400).json({ error: "ID not exists" });
  }
  return next();  
}

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(projects);
})


server.put('/projects/:id', checkIdExits, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id );

  project.title = title;

  return res.json(projects);
})

server.post('/projects/:id/tasks', checkIdExits, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id == id )

  project.tasks.push(title);

  return res.json(projects);
})

server.delete('/projects/:id', checkIdExits, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(proj => proj.id == id )
  
  projects.splice(index, 1);

  return res.send();
})

server.listen(3000);