import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


const registerUser = (userData)=> api.post("/auth/register",userData)
const loginUser = (userData)=> api.post("/auth/login",userData)
const getUserProfile = ()=> api.get("/auth/profile");

export {registerUser,loginUser,getUserProfile}


export default api;
