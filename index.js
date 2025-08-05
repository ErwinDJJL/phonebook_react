const express = require("express");
const morgan = require("morgan")
const cors = require('cors')

const app = express();

morgan('tiny')

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.use(express.json());


morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())


app.get("/api", (request, response) => {
    response.send("<h1>Api funcionando</h1>");
});

app.get("/info", (request, response) => {
    const fechaConsulta = new Date();
    let html =
        "<h3>" + "Phonebook has info for " + persons.length + " people" + "</h3>";
    html += "<p>" + fechaConsulta + "</p>";

    response.send(html);
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((p) => p.id === id);
    if (person) {
        response.json(person);

    } else response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((p) => p.id !== id);
    response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    console.log("Body: ", body);

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "name or number missing ",
        });
    }

    const name = body.name;
    const exist = persons.find((p) => p.name === name);
    if (exist) {
        return response.status(400).json({
            error: "name must be unique",
        });
    } else {
        const max = 1000000;
        const id = Math.floor(Math.random() * (max + 1));

        const person = {
            id: id,
            name: body.name,
            number: body.number
        };

        persons = persons.concat(person)

        response.json(person)
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

