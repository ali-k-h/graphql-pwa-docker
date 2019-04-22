const { buildSchema } = require('graphql');


exports.getSchema = () => buildSchema(`
    type Product {
        name: String  
        description: String
        initialCost: String
        zipcode: [String]
        image: String
    }

    input UserInput {
        name: String  
        email: String
        address: String
        city: String
        state: String
        zipcode: String
        phone: String
        payload: String
    }

    type User {
        id: String
        name: String  
        email: String
        address: String
        city: String
        state: String
        zipcode: String
        phone: String
    }

    type Query {
        getProducts (limit: Int): [Product]
        getUser(id: String): User
    }

    type Mutation {
        addUser(user: UserInput): User
        editUser(id: String, name: String, email: String): User
      }
`);
