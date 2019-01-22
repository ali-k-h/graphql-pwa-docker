module.exports = (mongoPath) => {
  const MongoClient = require('mongodb').MongoClient;
  // Database Name
  const dbName = 'solar';
  // Create a new MongoClient
  const client = new MongoClient(mongoPath);
  return new Promise ((resolve, reject) => {
    client.connect((err) => {
      if(err){
        console.log('!!!Failed to connect to db', url, err)
        reject(err);
      }
      console.log("***Connected successfully to mongoDB");
      const db = client.db(dbName);
      resolve(db);
   })
  });
}