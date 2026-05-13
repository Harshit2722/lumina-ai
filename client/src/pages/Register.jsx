import { useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import { registerUser } from '../api/axios';
import {toast} from 'react-hot-toast';

const Register = () => {
  const [formData,setFormData] = useState({
    name:"",
    email:"",
    password:""
  })
  const [errors, setErrors] = useState('');
  const [loading,setLoading] = useState(false);
  
  const navigate = useNavigate();
  const {register} = useAuth();


  const handleChange = (e) =>{
    const {name,value} = e.target;
    setFormData((prev)=>({...prev, [name]:value}))

    if(errors[name]){
      setErrors((prev)=>({...prev,[name]:""}))
    }
  }

  const validate = ()=>{
    const newErrors = {};

    //name
    if(!formData.name){
      newErrors.name = "Name is required";
    }

    //email
    if(!formData.email){
      newErrors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    //password
    if(!formData.password){
      newErrors.password = "Password is required";
    }
    else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validate()){
      return;
    }

    setLoading(true);
    
    try {
      const {data} = await registerUser(formData);
      const {user,token} = data.data;
      register(user,token);
      toast.success("Registration Successful");
      navigate('/dashboard');
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || 'Failed to register');
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register for Lumina AI</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              name="name"
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.name && <div className=" text-red-500">{errors.name}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && <div className=" text-red-500">{errors.email}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && <div className=" text-red-500">{errors.password}</div>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
