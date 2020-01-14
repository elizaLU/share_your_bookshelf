const express = require("express");
const graphqlHTTP = require("express-graphql"); //conventin var name for graphQL, helps express run graphQL API, use it as middleware on a route - endpoint to interact with graphQL data, this in one powerful endpoint through which all queries will be handled
const schema = require("./schema/schema");
const mongoose = require("mongoose");

const app = express();
//middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    //use graphiql tool when at /graphql adderss in the browser
    graphiql: true
  })
); //this function will handle all graphQL requests. it must contain a SCHEMA - how our graph looks

//connect to the database
mongoose.connect(
  "mongodb+srv://eliza32:mongoEL20@cluster0-4ohjh.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

mongoose.connection.once("open", () => {
  console.log("connected to the DB");
});
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`now listening on port ${port}`);
});
