const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());

app.use(express.json());

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));

let agenda = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": 5,
      "name": "Matias Lopez", 
      "number": "343 460-6845"
    }
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

//muestra la lista total de personas
app.get('/api/persons', (req, res) => {
    res.json(agenda);
});

//muestra el número total de personas en la agenda y la hora de la solicitud
app.get('/info', (req, res) => {
    const sinplu = agenda.length > 1 ? 'people' : 'person';
    res.send(
        `<div>
            <p>Phonebook has info for ${agenda.length} ${sinplu}</p>
            <p>${new Date()}</p>
        </div>`
    )
});

//muestra una persona en específico por su id, de no existir devuelve ERROR 404
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const data = agenda.find((person) => person.id === id);
    if (data) {
        res.json(data)
    } else {
        res.status(404).end();
    }
});

//elimina una persona en específico por su id
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    agenda = agenda.filter(person => person.id !== id);
    res.status(204).end();
});

//Función que genera un id random entre 0 y 10000000
const randomId = () => {
    const id = Math.floor(Math.random() * 10000001)
    return id;
}

//añade una persona nueva al array generando un id random
app.post('/api/persons', (req, res) => {
    const body = req.body;
    const verify = agenda.find(person => person.name === body.name);

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    } else if (verify) {
        return res.status(409).json({
            error: 'name must be unique'
        });
    }

    const newData = {
        id: randomId(),
        name: body.name,
        number: body.number
    }
    agenda = agenda.concat(newData);
    res.json(newData);
});

//establece el puerto para el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});