import axios from 'axios';

let baseURL;

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000/api/v1';
} else {
  baseURL = 'https://studio-search.herokuapp.com/api/v1';
}

const myAxios = axios.create({
  baseURL,
  timeout: 2000,
  withCredentials: true,
});

export default myAxios;
