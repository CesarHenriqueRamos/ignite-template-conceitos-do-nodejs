const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers
  const user = users.find(user => user.username === username)
  if(!user){
    return response.status(400).json({error:'Customer not found'})
  }
  request.user = user
  return next()
}


app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body
  const User = { 
    id: uuidv4(),
    name, 
    username, 
    todos: []
  }
  users.push(User)

  return response.status(201).json(User)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  return response.status(201).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title,deadline} = request.body
  const {user} = request;

  const todoFormat = { 
    id: uuidv4(),
    title,
    done: false, 
    deadline:new Date(deadline), 
    created_at: new Date()
  }
  user.todos.push(todoFormat)
  
  return response.status(201).json(user.todos)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title,deadline} = request.body
  const {id} = request.params
  const {user} = request;
  const todo = user.todos.find(todo => todo.id === id)
  if(!todo){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  todo.title = title
  todo.deadline = new Date(deadline)
  return response.status(201).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params
  const todo = user.todos.find(todo => todo.id === id)
  if(!todo){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  todo.done = true
  return response.status(201).json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params
  const todo = user.todos.findIndex(todo => todo.id === id)
  if(todo === -1){
    return response.status(404).json({error: 'Mensagem do erro'})
  }
  user.todos.splice(todo,1)
  return response.status(201).json(user)
});

module.exports = app;