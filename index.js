const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("postData", (request, response, next) =>
  JSON.stringify(request.body)
);

const morganFormat = (tokens, request, response) =>
  [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, "content-length"),
    "-",
    tokens["response-time"](request, response),
    "ms",
    request.method === "POST" ? tokens.postData(request, response) : "",
  ].join(" ");

app.use(morgan(morganFormat));

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

app.get("/info", (request, response) => {
  let markup = `<p>Phonebook has info for ${persons.length} people.</p>`;
  markup = markup.concat(`<p>${new Date().toString()}</p>`);
  response.send(markup);
});

app.get("/api/persons", (request, response) => response.json(persons));

const generateId = () => Math.floor(Math.random() * 1000 * 1000 * 1000);

const sendBadRequestError = (response, errorMessage) =>
  response.status(400).json({
    error: errorMessage,
  });

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return sendBadRequestError(response, "Name is missing.");
  }

  if (!body.number) {
    return sendBadRequestError(response, "Number is missing.");
  }

  const { name, number } = body;

  const doesNameExist = persons.some((p) => p.name === name);
  if (doesNameExist) {
    return sendBadRequestError(response, "Name must be unique.");
  }

  const newPerson = {
    name,
    number,
    id: generateId(),
  };

  persons = persons.concat(newPerson);

  response.status(201).json(newPerson);
});

app.get("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).end();
  }

  response.json(person);
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;

  if (!body.number) {
    return sendBadRequestError(response, "Number is missing.");
  }

  const id = parseInt(request.params.id);

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).send();
  }

  const updatedPerson = {
    ...person,
    number: body.number,
  };

  persons = persons.map((p) => (p.id !== id ? p : updatedPerson));

  response.status(201).json(updatedPerson);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = parseInt(request.params.id);

  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}.`));
