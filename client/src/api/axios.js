import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
  withCredentials: true
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
const logoutUser = () => api.post("/auth/logout")
const getUserProfile = ()=> api.get("/auth/profile");
const verifyEmail = (verifyData) => api.post("/auth/verify-email", verifyData);
const resendOTP = (emailData) => api.post("/auth/resend-otp", emailData);

export { registerUser, loginUser, getUserProfile, logoutUser, verifyEmail, resendOTP }


export default api;
