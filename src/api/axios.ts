import axios from 'axios';

export default axios.create({
  // baseURL: 'http://localhost:5000/api/users',
  baseURL: 'https://tasktrackerapi-lzeh.onrender.com/api/users',
  // baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});