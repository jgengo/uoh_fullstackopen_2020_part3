const express = require('express')

const app = express()
const PORT = 3001

app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Rica Zarai",
    number: "0143522643"
  }, {
    id: 2,
    name: "Gerard Depardieu",
    number: "0616015087"
  }, {
    id: 3,
    name: "Gerard Depardieu",
    number: "0616015087"
  }
]

app.get('/info', (req, res) => {

  res.send(`
  <p>Phonebook has info for ${persons.length}.</p>
  <p>${new Date}</p>
  `)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
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
  const id = persons[persons.length - 1].id + 1;
  const body = req.body;

  if (!body.name) return res.status(422).json({"eror": "name is missing"})
  if (!body.number) return res.status(422).json({"error": "number is missing"})
  
  if (persons.find(p => p.name === body.name)) return res.status(422).json({"error": "name must be unique"})

  data = {
    id: id, 
    name: body.name, 
    number: body.number
  }

  persons.push(data)
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})