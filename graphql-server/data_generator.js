const faker = require('faker');
const uuid = require('uuid/v4');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const nasaApi = require('./nasa_api');
const numberOfRecords = 20;
const nasaPAth = 'images/nasa';
const generateZipcodes = () => {
    let c = 10;
    const z = [];
    while(c > 0){
        z.push(faker.address.zipCode("#####"))
        c--;
    }
    return z;
};

const cleanDirectory = (directory) => {
    console.log('Cleaning the coast...');
    return new Promise((resolve, reject) => {
        fs.readdir(`./${directory}`, (err, files) => {
            if (err) throw new Error(err);
            files.forEach((file) => {
                fs.unlink(`./${directory}/${file}`, err => {
                    if (err) throw new Error(err);
                });
            })
          });

          resolve(true);
    })
};

const getImageUrl = async (nasaData, counter) => {
    const nasaImage = nasaData[counter].url;
    const imagePath = `${nasaPAth}/${uuid()}.jpg`;
    const writer = fs.createWriteStream(imagePath);
    const response = await axios({
        url: nasaImage,
        method:'GET',
        responseType:'stream'
    });

    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve(`/${imagePath}`))
        writer.on('error', reject)
      });
};

module.exports = async (db) => {
  try{
        console.log('Generating data...');
        const isTheCoastClean = await cleanDirectory(nasaPAth);
        if(!isTheCoastClean) throw new Error('cleanDirectory Error: The coast is filled with pointy rocks!');
        const nasaData = await nasaApi.getPlanetary(numberOfRecords);
        let counter = numberOfRecords - 1;
        const products = [];
        while (counter >= 0){
            const imageUrl = await getImageUrl(nasaData, counter);
            if(imageUrl){
                const zipcodes = generateZipcodes();
                products.push({
                    zipcode: zipcodes,
                    initialCost: faker.commerce.price(5500, 200000),
                    description: faker.lorem.sentences(),
                    name: faker.lorem.words(3,6),
                    image: imageUrl,
                })
                counter--;
            }
        }

        const product = db.collection('product');
        return new Promise((resolve, reject) => {
          product.insertMany(products, (err, result) => {
            if(err){
                console.error('data_generator.js inserMany error', err);
                reject('Error');
            }
            console.log('**Data is stored in DB');
            resolve(true);
          });
        });
    }
    catch(e){
        console.error('data_generator.js Error: ', e);
        return false;
    }
}
