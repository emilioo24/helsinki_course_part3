require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms  :body'));

//muestra la lista total de personas - GET
app.get('/api/persons', (req, res, next) => {
    Person.find({}).then((person) => {
        res.json(person);
    })
    .catch(error => next(error));
});

//muestra el número total de personas y la hora de la solicitud - GET
app.get('/info', (req, res, next) => {
    Person.find({}).then(result => {
        const sinplu = result.length > 1 ? 'people' : 'person';
        res.send(
            `<div>
                <p>Phonebook has info for ${result.length} ${sinplu}</p>
                <p>${new Date()}</p>
            </div>`
        )
    })
    .catch(error => next(error));
});

//muestra una persona en específico por su id, de no existir devuelve ERROR 404 - GET
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person);
            } else {
                res.status(404).end();
            }
        })
        .catch(error => next(error));
});

//elimina una persona en específico por su id - DELETE
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => next(error));
});

//Función que genera un id random entre 0 y 10000000
/*const randomId = () => {
    const id = Math.floor(Math.random() * 10000001)
    return id;
}*/

//añade una persona nueva al array - POST
app.post('/api/persons', (req, res) => {
    const body = req.body;
    //const verify = Person.find({ name: body.name }).then(name => name);

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        });
    } /*else if (false) {
        return res.status(409).json({
            error: 'name must be unique'
        });
    }*/

    const newData = new Person({
        name: body.name,
        number: body.number
    });

    newData.save().then((savedData) => {
        res.json(savedData);
    });
});

//actualiza el número de una persona con el mismo nombre - PUT
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body;

    const data = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, data, { new: true })
        .then(updatePerson => {
            res.json(updatePerson);
        })
        .catch(error => next(error));
});

//crea un middleware para las urls no encontradas
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint);

//crea un middleware para manejar los errores
const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    next(error);
}

app.use(errorHandler);

//establece el puerto para el servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});