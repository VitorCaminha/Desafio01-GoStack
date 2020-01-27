const express = require('express');

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

server.use((req, res, next) => {
  count++;
  console.log(count);

  return next();
});

function verifyIdExists(req, res, next) {
  const project = projects.find((project) => project.id == req.params.id);

  if(!project) {
    return res.status(400).send(`The project with id ${req.params.id} doesn't exists`);
  }
  
  return next();
}

server.post('/projects', (req, res) => {
  const project = {
    'id': req.body.id,
    'title': req.body.title,
    'tasks': [],
  };

  projects.push(project);

  return res.send();
});

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.put('/projects/:id', verifyIdExists, (req, res) => {
  projects
    .filter((project) => project.id == req.params.id)
    .forEach((project) => project.title = req.body.title);

  return res.send();
});

server.delete('/projects/:id', verifyIdExists, (req, res) => {
  const index = projects.findIndex((project) => project.id == req.params.id);
  projects.splice(index, 1);
  
  return res.send();
});

server.post('/projects/:id/tasks', verifyIdExists, (req, res) => {
  projects
    .filter((project) => project.id == req.params.id)
    .forEach((project) => project.tasks.push(req.body.title));

  return res.send();
});

server.listen(3000);