const mongoose = require('mongoose');

let print = false;
let name = '';
let number = '';

if (process.argv.length === 5) {
    name = process.argv[3];
    number = process.argv[4];
} else if (process.argv.length === 3) {
    print = true;
} else {
    console.log('need more data to process the app');
    process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://emilianogstroke:${password}@cluster0.y7lciof.mongodb.net/PhonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number
});

if (print) {
    Person.find({}).then(result => {
        console.log('phonebook:');
        result.forEach(person => {
          console.log(person.name, person.number);
        })
        mongoose.connection.close();
    });
} else {
    person.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close();
    });
}
