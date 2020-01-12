const graphql = require("graphql");
//define schema - data in form of graph: types + relations between types, defines root queries
const _ = require("lodash");
//1. object types
//destructuring grabs function graphQLOT from graphql, this function takes an object as an argument
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLInt, GraphQLID } = graphql;

//object type:
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    owner: { type: GraphQLString },
    pages: { type: GraphQLInt } //check this
  })
});
//root query setup - defines paths through u can query data
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      //when user makes query for a book, I expect args, e.g. id property
      args: { id: { type: GraphQLID } },
      //when query received - use resolve function
      resolve(parent, arg) {
        //function to get data from DB/other src; parent - relations..
        //args.id
        //use lodash lib for finding data from db, here from books array
        return _find(books, { id: args.id });
      }
    }
  }
});
//query example: book(id:"112"){name, genre}
//export schema, pass root query of this schema - we allow user to make such a query
module.exports = new GraphQLSchema({
  query: RootQuery
});
