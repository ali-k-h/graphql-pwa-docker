const faker = require('faker');
module.exports = (db) => {
    console.log('Generating data...');
    let counter = 1000;
    const products = [];
    while (counter > 0){
        products.push({
            zipcode: [faker.address.zipCode, faker.address.zipCode, faker.address.zipCode, faker.address.zipCode],
            initialCost: faker.commerce.price(5500, 200000),
            description: faker.lorem.sentences(),
            name: faker.lorem.words(3,6),
            image:''
        })
        counter--
    }
    const collection = db.collection('product');
    collection.insertMany(products);
    console.log('**Data are stored in DB');

}
