const graphql = require("graphql");
//define schema - data in form of graph: types + relations between types, defines root queries
const _ = require("lodash");
//1. object types
//destructuring grabs function graphQLOT from graphql, this function takes an object as an argument
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLBoolean
} = graphql;

// dummy data
const books = [
  {
    title: "Name of the Wind",
    genre: "Fantasy",
    id: "1",
    availability: true,
    authorId: "1",
    ownerId: "1"
  },
  {
    title: "The Final Empire",
    genre: "Fantasy",
    id: "2",
    availability: true,
    authorId: "2",
    ownerId: "1"
  },
  {
    title: "The Long Earth",
    genre: "Sci-Fi",
    id: "3",
    availability: true,
    authorId: "3",
    ownerId: "2"
  }
];

const authors = [
  { name: "Patrick", surname: "Rothfuss", age: 44, id: "1" },
  { name: "Brandon", surname: "Sanderson", age: 42, id: "2" },
  { name: "Terry", surname: "Pratchett", age: 66, id: "3" }
];

const owners = [
  { name: "Lucien", surname: "Palmboy", id: "1" },
  { name: "Ida", surname: "Esman", id: "2" }
];

//object types:
const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    genre: { type: GraphQLString },
    pages: { type: GraphQLInt },
    availability: { type: GraphQLBoolean },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        //parent - book here
        console.log("parent", parent);
        return _.find(authors, { id: parent.authorId }); //still dummy data
      }
    },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        return _.find(owners, { id: parent.ownerId }); //still dummy data
      }
    }
  })
});
//check how to query books by author
const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    works: {
      type: new GraphQLList(BookType),
      //resolve f to search works by author in the books array, id === this authorId
      resolve(parent, args) {
        console.log("parent in AuthorType", parent);
        return _.filter(books, { authorId: parent.id });
      }
    } //check this
  })
});
const OwnerType = new GraphQLObjectType({
  name: "Owner",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    books: { type: new GraphQLList(BookType) } //check this
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
      resolve(parent, args) {
        //function to get data from DB/other src; parent - relations..
        //args.id
        //use lodash lib for finding data from db, here from books array
        return _.find(books, { id: args.id });
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      }
    }
  }
});
//query example: book(id:"112"){name, genre}
//export schema, pass root query of this schema - we allow user to make such a query
module.exports = new GraphQLSchema({
  query: RootQuery
});
