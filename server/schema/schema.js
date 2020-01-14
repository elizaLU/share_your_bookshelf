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
//req mongoose models.
const Book = require("../models/book");
const Author = require("../models/author");
const Owner = require("../models/owner");

//object types:
const BookType = new GraphQLObjectType({
  name: "Book",
  //it has to be a function - parser calls this f whenever request includes fields from certain type
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
        //console.log("parent in BookType", parent);
        //return _.find(authors, { id: parent.authorId }); //still dummy data
      }
    },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        //return _.find(owners, { id: parent.ownerId }); //still dummy data
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
        //console.log("parent in AuthorType", parent);
        //return _.filter(books, { authorId: parent.id });
      }
    }
  })
});
const OwnerType = new GraphQLObjectType({
  name: "Owner",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      //resolve f to search works by author in the books array, id === this authorId
      resolve(parent, args) {
        //console.log("parent in OwnerType", parent);
        //return _.filter(books, { ownerId: parent.id });
      }
    }
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
        //return _.find(books, { id: args.id });
      }
    },
    //query to return all books {  books{    title    genre  }}
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(authors, { id: args.id });
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        // return authors;
      }
    },
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(owners, { id: args.id });
      }
    },
    owners: {
      type: new GraphQLList(OwnerType),
      resolve(parent, args) {
        //return owners;
      }
    }
  }
});
//query example: book(id:"112"){name, genre}
//in GraphQL it has to be difined what data can be mutated and how
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        surname: { type: GraphQLString }
        //no need to add works, it will be matched from the Books
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          surname: args.surname
        });
        //save to the database
       return author.save();
      }
    }
  }
});

//export schema, pass root query of this schema - we allow user to make such a query
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
