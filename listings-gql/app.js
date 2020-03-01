var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
var logger = require('morgan');
const { ApolloServer, gql } = require('apollo-server-express');
const MONGODB_URI = process.env.MONGODB_URI;

const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
});

let db;
(async () => {
    await client.connect();
    db = await client.db('bookings'); 
})();

const typeDefs = gql`
  type Query {
    listings(page: Int!): [Listing]
  }

  type Listing {
    _id: ID!
    name: String!
    summary: String
    picture_url: String
    listing_reviews: [Review] 
  }

  type Review {
      _id: ID!
      listing_id: ID!
      date: String
      reviewer_id: ID!
      reviewer_name: String!
      comments: String
  }
`;
const LISTINGS_PER_PAGE = 10;
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    listings: async (_, args, { db }) => {
        const { page } = args;
        
        listings = await db.collection('listings');
        const results = await listings
            .find({})
            .skip(page * LISTINGS_PER_PAGE)
            .limit(LISTINGS_PER_PAGE)
            .toArray();
        return results;
    },
  },
  Listing: {
    listing_reviews: async (listing, _, { db }) => {
          reviews = await db.collection('reviews');
          const results = await reviews
              .find({ listing_id: listing._id})
              // .skip(page * LISTINGS_PER_PAGE)
              .limit(10)
              .toArray();
          return results;
    }
  }
  
};

const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ db }) });

const app = express();
server.applyMiddleware({ app });

const port = process.env.PORT || 4000;
// app.listen({ port }, () =>
//   console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
// );

module.exports = app;
