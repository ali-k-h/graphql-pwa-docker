const nasaApi = require('./nasa_api');
const ObjectID = require('mongodb').ObjectID;

const processProduct = async (p) => {
  const nasaData = await nasaApi.getPlanetary(5);
  const nasaRecord = nasaData[3];
  p.name = nasaRecord.title;
  p.description = nasaRecord.explanation;
  return p;
}

// The root provides a resolver function for each API endpoint
exports.root = (db) => {
  return {
    getProducts: async ({limit}) => {
      try {
        products = await new Promise((resolve, reject) => {
          db.collection('product').find().limit(limit).toArray(
            (err, result) => {
              if (err) {
                console.error("Error reading data from database", err);
                reject("Error reading data from database", err);
              }
              resolve(result);
            }
          );
        });
        console.log("Product", products);
        return products.map(async (p) => {
          return await processProduct(p);
        });
      } catch (e) {
        console.log('Error getProducts', e);
        return products;
      }
    },
    addUser: (user) => {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .insertOne(user.user, (err, response) => {
            if (err) {
              console.error('addUser error', err);
              reject(err);
            } else {
              const user = response.ops[0];
              user.id = user._id.toString();
              console.log('One user added', user);
              resolve(user);
            }
          })
      });
    },
    getUser: ({
      id
    }) => {
      return new Promise((resolve, reject) => {
        db.collection("users")
          .findOne({
            _id: new ObjectID(id)
          }, (err, user) => {
            if (err) {
              console.error('getUser error', err);
              reject(err);
            } else {
              user.id = user._id.toString();
              resolve(user);
            }
          })
      });
    },
  }
};
