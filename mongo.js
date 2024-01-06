const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length !== 3 && process.argv.length !== 5) {
  displayUsage();
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.0c1nx.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

if (process.argv.length === 3) {
  displayPhonebook();
}

if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  createPerson(name, number);
}

function displayUsage() {
  console.log(
    `Usage:
  node mongo.js password - display all entries in the phonebook
  node mongo.js password name number - create a new phonebook entry`
  );
}

function displayPhonebook() {
  Person.find({}).then((persons) => {
    console.log("Phonebook:");
    persons.forEach((p) => console.log(`${p.name} ${p.number}`));
    mongoose.mongoose.connection.close();
  });
}

function createPerson(name, number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log("Person saved:", result);
    mongoose.connection.close();
  });
}
