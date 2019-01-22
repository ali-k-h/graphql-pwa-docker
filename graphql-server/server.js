const { graphql, buildSchema } = require('graphql');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const dataGenerator = require('./data_generator');
const axios = require('axios');
const mongoConnect  = require('./mongo_connect');

const start = async () => {
  try{
      // logger
    app.use(async (req, res, next) => {
      const start = Date.now();
      await next();
      const ms = Date.now() - start;
      console.log(`${req.method} ${req.baseUrl} took:  ${ms}ms`);
    });

    const db = await mongoConnect(process.env.MONGODB_PATH);
    dataGenerator(db);

    //API
    var nasaApi = `${process.env.NASA_PLANTARY_URL}?api_key=${process.env.NASA_API_KEY}`;
    axios.get(nasaApi).then((res) => {
      console.log('%%%%Data from NASA ', res.data)
    })

    const schema = buildSchema(`
      type Product {
        name: String  
        description: String
        initialCost: String
        zipcode:[String]
      }

      type Query {
        getProducts (productType: String): [Product]
      }
      `);

    // The root provides a resolver function for each API endpoint
    const root = {
      getProducts: ({productType}) => {
        switch (productType) {
          case 'sloar':
          return [
            {productType: 'solar', name:'low-energy', description:'produces low energy', weight:'2000lb'},
            {productType: 'solar', name:'high-energy', description:'produces a lot of energy', weight:'4000lb'},
            {productType: 'solar', name:'multi', description:'produces all sorts of energy', weight:'6000lb'},
          ];
            break;
          default:
          return [
            {productType: 'solar', name:'low-energy', description:'produces low energy', weight:'2000lb'},
            {productType: 'solar', name:'high-energy', description:'produces a lot of energy', weight:'4000lb'},
            {productType: 'solar', name:'multi', description:'produces all sorts of energy', weight:'6000lb'},
          ];
        }
      }
    };

    // app.use(/\/$/ , (req, res) => {
    //   res.sendFile('Working on it...');
    // })

    app.use('/graphql', graphqlHTTP({
      schema: schema,
      rootValue: root,
      graphiql: true,
    }));
    app.use('/api', (req, res) => {
      
    });
    app.listen(4000, () => {
      console.log('Running a GraphQL API server at localhost:4000/graphql');
    });
  }
  catch(e){
    console.log("Server Error:", e);
  }
};

start();

