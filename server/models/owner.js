const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//object passed here will describe types and properties of a book
const onwerSchema = new Schema({
  name: String,
  surname: String,
  });

//we make a model ( a collection in the db ): Book, it will have objects matching the bokSchema model
module.exports = mongoose.model("Owner", onwerSchema);
