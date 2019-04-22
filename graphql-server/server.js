const express = require('express');
const graphqlHTTP = require('express-graphql');
const app = express();
const dataGenerator = require('./data_generator');
const mongoConnect  = require('./mongo_connect');
const resolver = require('./resolver');
const schema = require('./schema').getSchema();

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

    app.use('/graphql-tool', graphqlHTTP({
      schema: schema,
      rootValue: resolver.root(db),
      graphiql: true,
    }));

    app.use('/api', graphqlHTTP({
      schema: schema,
      rootValue: resolver.root(db),
    }));

    app.get('/gendata', async (req, res) =>{
    //  try{
      //  const response = await dataGenerator(db);
      //  if(response){
          res.send(await dataGenerator(db)?'Data is generated':'Sorry! not a very successful attempt!');
      //  }
      // }
      // catch(e){
      //   res.send(`Sorry! not a very successful attempt!${e}`);
      // }
    });

    app.listen(4000, () => {
      console.log('Running a GraphQL API server at port 4000');
    });
  }
  catch(e){
    console.log("Server Error:", e);
  }
};

start();
