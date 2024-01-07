const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((_) => console.log("Connected to MongoDB"))
  .catch((error) =>
    console.error("Failed to connect to MongoDB:", error.message)
  );

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

mongoose.set("strictQuery", false);

module.exports = mongoose.model("Person", personSchema);
