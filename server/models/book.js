const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//object passed here will describe types and properties of a book
const bookSchema = new Schema({
  title: String,
  genre: String,
  availability: Boolean,
  author: String,
  owner: String
});

//we make a model ( a collection in the db ): Book, it will have objects matching the bokSchema model
module.exports = mongoose.model("Book", bookSchema);
