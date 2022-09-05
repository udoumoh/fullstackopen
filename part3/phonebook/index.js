const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Phone = require('./models/phonebook')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted Id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(cors())

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(phones => {
    response.json(phones)
  })
})

app.get('/info', (request, response) => {
  Phone.find({}).then(phones => {
    response.send(`<div><p>Phonebook has info for ${phones.length} people</p><p>${new Date()}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Phone.findById(id).then(persons => response.json(persons))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Phone.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch(err => next(err))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Phone({
    name: body.name,
    number: body.number,
  })
  Phone.findOne({ 'name':body.name })
    .then(result => {
      if (result){
        response.status(400).send({ error: 'name already exists' })
      }
      if(!result){
        person.save().then(person => response.json(person))
          .catch(err => next(err))
      }
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const id = request.params.id

  Phone.findByIdAndUpdate(id, { name, number }, { new: true, runValidators: true, context:'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log('server listening on port', PORT))