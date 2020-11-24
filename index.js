require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person');

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json());
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
		].join(' ');
	})
);
app.use(cors());
app.use(express.static('build'))


app.get('/info', (req, res) => {

  res.send(`
  <p>Phonebook has info for ${persons.length}.</p>
  <p>${new Date}</p>
  `)
})

app.get('/api/persons', (_req, res) => {
  Person.find({})
  .then( (results) => {
    console.log(results) 
    res.json(results)
  })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id)
    if (person) return res.json(person)
    return res.status(404).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body;

  if (!body.name) return res.status(400).json({"eror": "name is missing"})
  if (!body.number) return res.status(400).json({"error": "number is missing"})
  
  // if (Person.find({name: body.name})) return res.status(400).json({"error": "name must be unique"})

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then( (savedPerson) => {
    res.json(savedPerson)
  })
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})