require("dotenv").config();

const Person = require("./models/person");

const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.static("dist"));
app.use(express.json());

// morgan logger config

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

// route handlers

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    let markup = `<p>Phonebook has info for ${persons.length} people.</p>`;
    markup = markup.concat(`<p>${new Date().toString()}</p>`);
    response.send(markup);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => response.json(persons));
});

const throwBadRequestError = (errorMessage) => {
  const error = new Error(errorMessage);
  error.name = "BadRequest";
  throw error;
};

app.post("/api/persons", (request, response, next) => {
  try {
    const body = request.body;

    if (!body.name) {
      return throwBadRequestError("Name is missing.");
    }

    if (!body.number) {
      return throwBadRequestError("Number is missing.");
    }

    const { name, number } = body;

    // const doesNameExist = persons.some((p) => p.name === name);
    // if (doesNameExist) {
    //   return sendBadRequestError(response, "Name must be unique.");
    // }

    const newPerson = new Person({
      name,
      number,
    });

    newPerson
      .save()
      .then((savedPerson) => response.status(201).json(savedPerson));
  } catch (error) {
    next(error);
  }
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).end();
    }

    response.json(person);
  });
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return throwBadRequestError("Name is missing.");
  }

  if (!body.number) {
    return throwBadRequestError("Number is missing.");
  }

  const { name, number } = body;

  const updatedPerson = {
    name,
    number,
  };

  Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
    .then((updatedPerson) => response.status(201).json(updatedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => response.status(204).end())
    .catch((error) => next(error));
});

// error handlers

const unknownEndpointHandler = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint." });
};

app.use(unknownEndpointHandler);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformed id." });
  }

  if (error.name === "BadRequest") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

// start server

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running at port ${PORT}.`));
