import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:5000/api/users',
  baseURL: 'https://tasktrackerapi-9nfn.onrender.com/api/users',
  withCredentials: true,
});