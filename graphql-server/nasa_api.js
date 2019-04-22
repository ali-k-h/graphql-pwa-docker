const axios = require('axios');
exports.getPlanetary = async (count) => {
  let nasaApi = `${process.env.NASA_PLANTARY_URL}?api_key=${process.env.NASA_API_KEY}`;
  if(count){
      nasaApi =  `${nasaApi}&count=${count}`;
  }
  const data =  await axios.get(nasaApi);
  return data.data;
};
