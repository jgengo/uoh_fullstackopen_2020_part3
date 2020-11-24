const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('usage: node mongo.js <password> [<name> <number>]')
  process.exit(1)
}

const password = process.argv[2];

const url =
  `mongodb+srv://titus:${password}@cluster0.x1puv.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

const create = (name, number) => {
  const phone = new Phone({
    name: name,
    number: number
  })
  phone.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })  
}

const index = () => {
  Phone.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(phone => {
        console.log(`${phone.name}: ${phone.number}`)
    })
    mongoose.connection.close()
  })
}



if (process.argv.length >= 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  create(name, number);
} else {
  index();
}






