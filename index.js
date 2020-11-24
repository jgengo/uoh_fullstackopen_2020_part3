require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(
  morgan((token, req, res) => {
    return [
      token.method(req, res),
      token.url(req, res),
      token.status(req, res),
      token.res(req, res, 'content-length'),
      '-',
      token['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
)
app.use(cors())
app.use(express.static('build'))



app.get('/info', (req, res, next) => {
  Person.find({})
    .then( results => {
      res.send(`
      <p>Phonebook has info for ${results.length}.</p>
      <p>${new Date}</p>
      `)
    })
    .catch( (err) => next(err))
})

app.get('/api/persons', (_req, res) => {
  Person.find({})
    .then( (results) => res.json(results) )
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then( (person) => {
      if (person) {
        return res.json(person)
      } else {
        return res.status(404).end()
      }
    })
    .catch( (err) => next(err) )
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then( () => {
      res.status(204).end()
    })
    .catch (err => next (err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then( (savedPerson) => {
      res.json(savedPerson)
    })
    .catch( err => next(err))
})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})