const dotenv = require('dotenv');
const axios = require('axios');

const initEnv = async () => {
  try {
    dotenv.config();
  } catch (err) {
    console.log('Error loading dotenv');
  }
};

const fetchData = async () => {
  // TODO
  const url = 'https://jsonplaceholder.typicode.com/posts';
  const result = await axios.get(url);
  const { status, data } = result;
  return status === 200 && data && Array.isArray(data) ? data : [];
};

module.exports = {
  initEnv,
  fetchData
};
